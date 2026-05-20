<?php

/**
 * Plugin Name: Mega Menu Blocks
 * Plugin URI: https://github.com/mildmedia/mild-megamenu
 * Description: Build better navigation menus with the WordPress mega menu blocks.
 * Version: 1.1.41
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
	define( 'MILD_MEGAMENU_VERSION', '1.1.41' );
}
define( 'MILD_MEGAMENU_FILE', __FILE__ );
define( 'MILD_MEGAMENU_DIR', plugin_dir_path( __FILE__ ) );

require_once MILD_MEGAMENU_DIR . 'includes/GitHubUpdater.php';

( new GitHubUpdater(
	plugin_file: MILD_MEGAMENU_FILE,
	github_repo: 'mildmedia/mild-megamenu',
) )->register();

if ( ! function_exists( __NAMESPACE__ . '\\megamenu_init' ) && function_exists( 'register_block_type' ) ) {
	function megamenu_init() {
		include( plugin_dir_path( MILD_MEGAMENU_FILE ) . 'includes/BlockRegister.php' );
		new BlockRegister();
	}

	megamenu_init();
}
