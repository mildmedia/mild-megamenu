<?php


namespace Mild\Plugins\MegaMenu;


class MegaMenu extends AbstractBlock {

	public function __construct() {
		parent::__construct();
	}

	public function render_callback( $attributes, $content ) {

		$collapse_on_mobile = ! isset( $attributes['collapseOnMobile'] ) || $attributes['collapseOnMobile'];

		$classes = array_merge(
			isset( $attributes['className'] ) ? array( $attributes['className'] ) : array(),
			isset( $attributes['align'] ) ? array( 'align' . $attributes['align'] ) : array(),
			isset( $attributes['itemsJustification'] ) ? array( 'justify-items-' . $attributes['itemsJustification'] ) : array(),
			isset( $attributes['expandDropdown'] ) && $attributes['expandDropdown'] ? array( 'has-full-width-dropdown' ) : array(),
			$collapse_on_mobile ? array('is-collapsible') : array()
		);

		$html = '<div class="wp-block-mild-megamenu megamenu ' . esc_attr( implode( ' ', $classes ) ) . '"';
		if ( isset( $attributes['dropdownMaxWidth'] ) ) {
			$html .= ' data-dropdown-width="' . absint( $attributes['dropdownMaxWidth'] ) . '"';
		}
		if ( isset( $attributes['dropdownContentMaxWidth'] ) ) {
			$html .= ' data-dropdown-content-width="' . absint( $attributes['dropdownContentMaxWidth'] ) . '"';
		}

		$responsive_breakpoint = isset( $attributes['responsiveBreakpoint'] ) ? absint( $attributes['responsiveBreakpoint'] ) : 782;

		$html .= ' data-responsive-breakpoint="' . $responsive_breakpoint . '"';
		$html .= '>';

		$html .= '<nav class="megamenu__wrapper"';
		if ( isset( $attributes['menuMaxWidth'] ) ) {
			$html .= ' style="max-width:' . absint( $attributes['menuMaxWidth'] ) . 'px"';
		}
		$html .= '>';

		if ( $collapse_on_mobile ) {
			$toggle_button_alignment_style = isset( $attributes['toggleButtonAlignment'] ) ? 'style="text-align: ' . esc_attr( $attributes['toggleButtonAlignment'] ) . ';"' : '';

			$button = '<button class="megamenu__toggle"><span class="dashicons dashicons-menu"></span>' . esc_html__( 'Menu', 'mild-megamenu' ) . '</button>';
			$button = apply_filters( 'mild-megamenu/blocks/megamenu/mobile-toggle-button', $button, $classes );

			$html .= '<div class="megamenu__toggle-wrapper is-hidden" ' . $toggle_button_alignment_style . '>';
			$html .= $button;
			$html .= '</div>';
		}

		$html .= '<div class="megamenu__content-wrapper">';
		$html .= '<ul class="megamenu__content">';
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
