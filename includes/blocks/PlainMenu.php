<?php


namespace Mild\Plugins\MegaMenu;


class PlainMenu extends AbstractBlock {

	public function __construct() {
		parent::__construct();
	}

	public function render_callback( $attributes, $content, $block = null ) {
		$classes = array_merge(
			isset( $attributes['className'] ) ? array( $attributes['className'] ) : array(),
			isset( $attributes['itemsJustification'] ) ? array( 'justify-items-' . $attributes['itemsJustification'] ) : array(),
			isset( $attributes['orientation'] ) ? array( 'is-orientation-' . $attributes['orientation'] ) : array()
		);

		$html     = '';
		$block_id = wp_unique_id( 'plain-menu-' );

		if ( isset( $attributes['linkPaddingHorizontal'] ) || isset( $attributes['linkPaddingVertical'] ) ) {
			$h     = isset( $attributes['linkPaddingHorizontal'] ) ? absint( $attributes['linkPaddingHorizontal'] ) . 'px' : '0';
			$v     = isset( $attributes['linkPaddingVertical'] ) ? absint( $attributes['linkPaddingVertical'] ) . 'px' : '0';
			$sel   = "#{$block_id}>.plainmenu__content>.plainmenu-item>.plainmenu-item__link>a";
			$html .= "<style>{$sel}{padding:{$v} {$h}}</style>";
		}

		$wrapper_attrs = array_merge(
			[ 'id' => $block_id, 'class' => 'plainmenu ' . implode( ' ', $classes ) ],
		);

		$html .= '<nav ' . get_block_wrapper_attributes( $wrapper_attrs ) . '>';
		$gap              = isset( $attributes['style']['spacing']['blockGap'] ) ? $attributes['style']['spacing']['blockGap'] : null;
		$gap              = $gap ? preg_replace( '/^var:preset\|spacing\|(.+)$/', 'var(--wp--preset--spacing--$1)', $gap ) : null;
		$content_style    = $gap ? ' style="gap: ' . esc_attr( $gap ) . '"' : '';
		$html .= '<ul class="plainmenu__content"' . $content_style . '>';
		$html .= $content;
		$html .= '</ul></nav>';

		return $html;
	}

	protected function setName() {
		$this->name = 'mild-megamenu/plain-menu';
	}

	protected function setStyle() {
		$this->style = 'mild-megamenu-block-style';
	}

	protected function setEditorStyle() {
		$this->editor_style = 'mild-megamenu-block-editor';
	}

	protected function setEditorScript() {
		$this->editor_script = 'mild-megamenu-block';
	}
}
