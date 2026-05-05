<?php
namespace Mild\Plugins\MegaMenu;


class MegaMenu extends AbstractBlock {

	public function __construct() {
		parent::__construct();
	}

	public function render_callback( $attributes, $content ) {

		$collapse_on_mobile = ! isset( $attributes['collapseOnMobile'] ) || $attributes['collapseOnMobile'];

		$extra_classes = array_filter( array_merge(
			[ 'megamenu' ],
			isset( $attributes['align'] ) ? [ 'align' . $attributes['align'] ] : [],
			isset( $attributes['itemsJustification'] ) ? [ 'justify-items-' . $attributes['itemsJustification'] ] : [],
			isset( $attributes['expandDropdown'] ) && $attributes['expandDropdown'] ? [ 'has-full-width-dropdown' ] : [],
			$collapse_on_mobile ? [ 'is-collapsible' ] : []
		) );

		$wrapper_attrs = [ 'class' => implode( ' ', $extra_classes ) ];


		$wrapper_attrs['data-responsive-breakpoint'] = isset( $attributes['responsiveBreakpoint'] ) ? absint( $attributes['responsiveBreakpoint'] ) : 782;

		$block_id = wp_unique_id( 'megamenu-' );
		$wrapper_attrs['id'] = $block_id;

		$html = '';
		if ( isset( $attributes['linkPaddingHorizontal'] ) || isset( $attributes['linkPaddingVertical'] ) ) {
			$h    = isset( $attributes['linkPaddingHorizontal'] ) ? absint( $attributes['linkPaddingHorizontal'] ) . 'px' : '0';
			$v    = isset( $attributes['linkPaddingVertical'] ) ? absint( $attributes['linkPaddingVertical'] ) . 'px' : '0';
			$sel  = "#{$block_id}>.megamenu-wrapper>.megamenu-content-wrapper>.megamenu-content>.menu-item>.menu-item-link>a";
			$html .= "<style>{$sel}{padding:{$v} {$h}}</style>";
		}

		$html .= '<div ' . get_block_wrapper_attributes( $wrapper_attrs ) . '>';

		$html .= '<nav class="megamenu-wrapper"';
		if ( isset( $attributes['menuMaxWidth'] ) ) {
			$html .= ' style="max-width:' . absint( $attributes['menuMaxWidth'] ) . 'px"';
		}
		$html .= '>';

		if ( $collapse_on_mobile ) {
			$toggle_button_alignment_style = isset( $attributes['toggleButtonAlignment'] ) ? 'style="text-align: ' . esc_attr( $attributes['toggleButtonAlignment'] ) . ';"' : '';

			$button = '<button class="megamenu-toggle"><span class="dashicons dashicons-menu"></span>' . esc_html__( 'Menu', 'mild-megamenu' ) . '</button>';
			$button = apply_filters( 'mild-megamenu/blocks/megamenu/mobile-toggle-button', $button, $extra_classes );

			$html .= '<div class="megamenu-toggle-wrapper is-hidden" ' . $toggle_button_alignment_style . '>';
			$html .= $button;
			$html .= '</div>';
		}

		$html .= '<div class="megamenu-content-wrapper">';
		$html .= '<ul class="megamenu-content">';
		$html .= $content;
		$html .= '</ul></div></nav></div>';

		return $html;
	}

	protected function setName() {
		$this->name = 'mild-megamenu/menu';
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
