<?php

/**
 * Plugin Name: Mega Menu Blocks
 * Plugin URI: https://github.com/mildmedia/mild-megamenu/tree/master
 * Description: Build better navigation menus with the WordPress mega menu blocks.
 * Version: 1.1.1
 * Author: Mild + John Doe
 * Author URI: https://github.com/mildmedia/
 * License: GPLv2 or later
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: mild-megamenu
 */

namespace Mild\Plugins\MegaMenu;

defined( 'ABSPATH' ) || exit;

define( 'MILD_MEGAMENU_VERSION', '1.1.0' );
define( 'MILD_MEGAMENU_FILE', __FILE__ );

if ( ! function_exists( 'megamenu_init' ) && function_exists( 'register_block_type' ) ) {
	function megamenu_init() {
		include( plugin_dir_path( MILD_MEGAMENU_FILE ) . 'includes/BlockRegister.php' );
		new BlockRegister();
	}

	megamenu_init();
}
