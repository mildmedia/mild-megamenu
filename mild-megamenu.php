<?php

/**
 * Plugin Name: Mega Menu Blocks
 * Plugin URI: https://github.com/mildmedia/mild-megamenu
 * Description: Build better navigation menus with the WordPress mega menu blocks.
 * Version: 1.1.71
 * Requires at least: 6.7
 * Requires PHP: 8.3
 * Author: Mild + John Doe
 * Author URI: https://github.com/mildmedia/
 * License: GPLv2 or later
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: mild-megamenu
 * Update URI: https://github.com/mildmedia/mild-megamenu
 */

namespace Mild\Plugins\MegaMenu;

defined( 'ABSPATH' ) || exit;

if ( strstr( $_SERVER['HTTP_HOST'], 'lndo.site' ) ) {
	define( 'MILD_MEGAMENU_VERSION', time() );
} else {
	define( 'MILD_MEGAMENU_VERSION', '1.1.71' );
}
define( 'MILD_MEGAMENU_FILE', __FILE__ );
define( 'MILD_MEGAMENU_DIR', plugin_dir_path( __FILE__ ) );

require_once MILD_MEGAMENU_DIR . 'includes/GitHubUpdater.php';
require_once MILD_MEGAMENU_DIR . 'includes/GetwidMigrator.php';

( new GitHubUpdater(
	plugin_file: MILD_MEGAMENU_FILE,
	github_repo: 'mildmedia/mild-megamenu',
) )->register();

if ( ! function_exists( __NAMESPACE__ . '\\megamenu_init' ) && function_exists( 'register_block_type' ) ) {
	function megamenu_init() {
		include( plugin_dir_path( MILD_MEGAMENU_FILE ) . 'includes/BlockRegister.php' );
		new BlockRegister();
		register_getwid_migrator_hooks();
	}

	function register_getwid_migrator_hooks(): void {
		add_action( 'rest_api_init', function () {
			GetwidMigrator::register_rest_route();
		} );
		add_action( 'admin_menu', __NAMESPACE__ . '\\getwid_migrator_admin_menu' );
		add_action( 'admin_post_mild_megamenu_migrate_getwid', __NAMESPACE__ . '\\getwid_migrator_handle_post' );

		if ( defined( 'WP_CLI' ) && \WP_CLI ) {
			\WP_CLI::add_command( 'mild-megamenu migrate-getwid', __NAMESPACE__ . '\\getwid_migrator_cli' );
		}
	}

	function getwid_migrator_admin_menu(): void {
		add_management_page(
			'Convert Getwid Mega Menu',
			'Convert Getwid Menu',
			'manage_options',
			'mild-megamenu-migrate-getwid',
			__NAMESPACE__ . '\\getwid_migrator_admin_page'
		);
	}

	function getwid_migrator_admin_page(): void {
		$posts = GetwidMigrator::find_posts();
		$count = count( $posts );
		?>
		<div class="wrap">
			<h1>Convert Getwid Mega Menu → Mild Mega Menu</h1>
			<?php if ( isset( $_GET['converted'] ) ) : ?>
				<div class="notice notice-success"><p>
					<?php echo esc_html( intval( $_GET['converted'] ) ); ?> post(s) converted successfully.
				</p></div>
			<?php endif; ?>
			<?php if ( $count > 0 ) : ?>
				<p>Found <strong><?php echo esc_html( $count ); ?></strong> post(s) containing getwid-megamenu blocks:</p>
				<ul>
					<?php foreach ( $posts as $id ) : ?>
						<li><a href="<?php echo esc_url( get_edit_post_link( $id ) ); ?>"><?php echo esc_html( get_the_title( $id ) ); ?></a> (ID: <?php echo esc_html( $id ); ?>)</li>
					<?php endforeach; ?>
				</ul>
				<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
					<input type="hidden" name="action" value="mild_megamenu_migrate_getwid">
					<?php wp_nonce_field( 'mild_megamenu_migrate_getwid' ); ?>
					<p><input type="submit" class="button button-primary" value="Convert all <?php echo esc_attr( $count ); ?> post(s)"></p>
				</form>
			<?php else : ?>
				<p>No posts with getwid-megamenu blocks found.</p>
			<?php endif; ?>
		</div>
		<?php
	}

	function getwid_migrator_handle_post(): void {
		check_admin_referer( 'mild_megamenu_migrate_getwid' );
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( 'Unauthorized' );
		}

		$posts     = GetwidMigrator::find_posts();
		$converted = 0;
		foreach ( $posts as $id ) {
			if ( GetwidMigrator::convert_post( intval( $id ) ) ) {
				$converted++;
			}
		}

		wp_redirect( admin_url( 'tools.php?page=mild-megamenu-migrate-getwid&converted=' . $converted ) );
		exit;
	}

	function getwid_migrator_cli( array $_args, array $assoc_args ): void {
		$post_id = isset( $assoc_args['post-id'] ) ? intval( $assoc_args['post-id'] ) : null;

		if ( $post_id ) {
			$result = GetwidMigrator::convert_post( $post_id );
			$result
				? \WP_CLI::success( "Converted post {$post_id}." )
				: \WP_CLI::warning( "No getwid-megamenu content found in post {$post_id}." );
			return;
		}

		$posts = GetwidMigrator::find_posts();
		\WP_CLI::line( 'Found ' . count( $posts ) . ' post(s) to convert.' );
		foreach ( $posts as $id ) {
			GetwidMigrator::convert_post( intval( $id ) );
			\WP_CLI::line( "  Converted post {$id}: " . get_the_title( intval( $id ) ) );
		}
		\WP_CLI::success( 'Done.' );
	}

	megamenu_init();
}
