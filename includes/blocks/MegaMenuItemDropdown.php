<?php


namespace Mild\Plugins\MegaMenu;


class MegaMenuItemDropdown {

	public function __construct() {
		$this->register();
	}

	public function register() {
		\register_block_type(
			\plugin_dir_path( MILD_MEGAMENU_FILE ) . 'build/menu-item-dropdown',
			[
				'editor_script' => 'mild-megamenu-block',
				'editor_style'  => 'mild-megamenu-block-editor',
				'style'         => 'mild-megamenu-block-style',
			]
		);
	}
}
