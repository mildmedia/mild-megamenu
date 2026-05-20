<?php
namespace Mild\Plugins\MegaMenu;

defined( 'ABSPATH' ) || exit;

/**
 * Minimal GitHub-releases plugin updater.
 *
 * Polls https://api.github.com/repos/{owner}/{repo}/releases/latest, compares
 * the tag against the plugin's installed Version, and offers an update via
 * WordPress's standard plugin update flow. No external services, no secrets.
 *
 * Cache: 15 minutes (transient). Visiting wp-admin/plugins.php while the cache
 * has expired forces a refresh before the page renders.
 *
 * For public repos no token is required (GitHub allows 60 unauthenticated
 * requests/hour per IP). For private repos pass a PAT as $access_token; it is
 * sent as an Authorization: Bearer header on each API call.
 */
final class GitHubUpdater {

	private const API_BASE = 'https://api.github.com';

	private string $plugin_basename;
	private string $plugin_slug;
	private string $cache_key;

	public function __construct(
		private readonly string $plugin_file,
		private readonly string $github_repo,
		private readonly int $cache_ttl_seconds = 900,
		private readonly ?string $access_token = null,
	) {
		$this->plugin_basename = plugin_basename( $plugin_file );
		$this->plugin_slug     = dirname( $this->plugin_basename );
		$this->cache_key       = 'mild_gh_updater_' . md5( $github_repo );
	}

	public function register(): void {
		add_filter( 'pre_set_site_transient_update_plugins', [ $this, 'inject_update' ] );
		add_filter( 'plugins_api', [ $this, 'plugin_info' ], 20, 3 );
		add_filter( 'upgrader_source_selection', [ $this, 'fix_source_dir' ], 10, 4 );

		if ( is_admin() ) {
			add_action( 'load-plugins.php', [ $this, 'maybe_refresh_on_plugins_page' ] );
		}
	}

	/**
	 * Force a fresh update check when the plugins list is loaded, if our cache
	 * has already expired. Runs before the page renders so the list reflects
	 * the latest GitHub release immediately.
	 */
	public function maybe_refresh_on_plugins_page(): void {
		if ( get_transient( $this->cache_key ) !== false ) {
			return;
		}

		delete_site_transient( 'update_plugins' );
		if ( function_exists( 'wp_update_plugins' ) ) {
			wp_update_plugins();
		}
	}

	public function inject_update( $transient ) {
		if ( empty( $transient ) || empty( $transient->checked ) ) {
			return $transient;
		}

		$current = $transient->checked[ $this->plugin_basename ] ?? null;
		if ( ! $current ) {
			return $transient;
		}

		$release = $this->get_latest_release();
		if ( ! $release ) {
			return $transient;
		}

		$remote = $this->normalize_version( $release['tag_name'] );
		if ( ! version_compare( $remote, $current, '>' ) ) {
			return $transient;
		}

		$transient->response[ $this->plugin_basename ] = (object) [
			'id'            => $this->github_repo . '/' . $this->plugin_basename,
			'slug'          => $this->plugin_slug,
			'plugin'        => $this->plugin_basename,
			'new_version'   => $remote,
			'url'           => $release['html_url'],
			'package'       => $this->package_url( $release ),
			'icons'         => [],
			'banners'       => [],
			'banners_rtl'   => [],
			'tested'        => '',
			'requires_php'  => '',
			'compatibility' => new \stdClass(),
		];

		return $transient;
	}

	public function plugin_info( $result, string $action, $args ) {
		if ( $action !== 'plugin_information' ) {
			return $result;
		}
		if ( ! isset( $args->slug ) || $args->slug !== $this->plugin_slug ) {
			return $result;
		}

		$release = $this->get_latest_release();
		if ( ! $release ) {
			return $result;
		}

		$plugin_data = get_file_data( $this->plugin_file, [
			'Name'    => 'Plugin Name',
			'Author'  => 'Author',
			'Version' => 'Version',
		] );

		return (object) [
			'name'          => $plugin_data['Name'],
			'slug'          => $this->plugin_slug,
			'version'       => $this->normalize_version( $release['tag_name'] ),
			'author'        => $plugin_data['Author'],
			'homepage'      => $release['html_url'],
			'requires'      => '',
			'tested'        => '',
			'requires_php'  => '',
			'download_link' => $this->package_url( $release ),
			'trunk'         => $this->package_url( $release ),
			'last_updated'  => $release['published_at'] ?? '',
			'sections'      => [
				'description' => '',
				'changelog'   => $this->format_changelog( $release['body'] ?? '' ),
			],
		];
	}

	/**
	 * GitHub source zipballs unpack to "{owner}-{repo}-{hash}/". Rename to the
	 * plugin slug so WP doesn't move the plugin to a wrong directory.
	 * Release-attached asset zips (recommended) already have the correct
	 * structure and bypass this rename.
	 */
	public function fix_source_dir( string $source, string $remote, $upgrader, $hook_extra ) {
		if ( ! isset( $hook_extra['plugin'] ) || $hook_extra['plugin'] !== $this->plugin_basename ) {
			return $source;
		}

		$expected = trailingslashit( dirname( $source ) ) . $this->plugin_slug . '/';
		if ( trailingslashit( $source ) === $expected ) {
			return $source;
		}

		global $wp_filesystem;
		if ( ! $wp_filesystem ) {
			return $source;
		}

		$wp_filesystem->move( $source, $expected );
		return $expected;
	}

	private function get_latest_release(): ?array {
		$cached = get_transient( $this->cache_key );
		if ( is_array( $cached ) ) {
			return $cached;
		}

		$args = [
			'timeout' => 10,
			'headers' => [
				'Accept'     => 'application/vnd.github+json',
				'User-Agent' => 'wp-mild-github-updater',
			],
		];
		if ( $this->access_token ) {
			$args['headers']['Authorization'] = 'Bearer ' . $this->access_token;
		}

		$url      = self::API_BASE . '/repos/' . $this->github_repo . '/releases/latest';
		$response = wp_remote_get( $url, $args );

		if ( is_wp_error( $response ) || wp_remote_retrieve_response_code( $response ) !== 200 ) {
			return null;
		}

		$data = json_decode( wp_remote_retrieve_body( $response ), true );
		if ( ! is_array( $data ) || empty( $data['tag_name'] ) ) {
			return null;
		}

		set_transient( $this->cache_key, $data, $this->cache_ttl_seconds );
		return $data;
	}

	private function package_url( array $release ): string {
		foreach ( $release['assets'] ?? [] as $asset ) {
			$name = strtolower( (string) ( $asset['name'] ?? '' ) );
			if ( str_ends_with( $name, '.zip' ) ) {
				return (string) $asset['browser_download_url'];
			}
		}
		return (string) ( $release['zipball_url'] ?? '' );
	}

	private function normalize_version( string $tag ): string {
		return ltrim( $tag, 'vV' );
	}

	private function format_changelog( string $md ): string {
		return $md === '' ? '' : wpautop( wp_kses_post( $md ) );
	}
}
