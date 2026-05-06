<?php


namespace Mild\Plugins\MegaMenu;


abstract class AbstractBlock {

	protected $name;
	protected $style;
	protected $editor_style;
	protected $editor_script;

	public function __construct() {
		$this->setName();
		$this->setStyle();
		$this->setEditorStyle();
		$this->setEditorScript();
		$this->register();
	}

	public function register() {
		$block_folder = substr( $this->name, strlen( 'mild-megamenu/' ) );
		\register_block_type(
			\plugin_dir_path( MILD_MEGAMENU_FILE ) . 'build/' . $block_folder,
			[
				'style'           => $this->style,
				'editor_style'    => $this->editor_style,
				'editor_script'   => $this->editor_script,
				'render_callback' => [$this, 'render_callback']
			]
		);
	}

	public function render_callback( $attributes, $content, $block = null ) {
		return $content;
	}

	abstract protected function setName();

	abstract protected function setStyle();

	abstract protected function setEditorStyle();

	abstract protected function setEditorScript();

}