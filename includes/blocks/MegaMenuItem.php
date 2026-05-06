<?php


namespace Mild\Plugins\MegaMenu;


class MegaMenuItem extends AbstractBlock {

	public function __construct() {
		parent::__construct();
	}

	public function render_callback( $attributes, $content ) {
		$html = '';

		if ( empty( $attributes['text'] ) ) {
			return $html;
		}

		$attributes['text'] = wp_kses(
			$attributes['text'],
			array(
				'code'   => array(),
				'em'     => array(),
				'img'    => array(
					'scale' => array(),
					'class' => array(),
					'style' => array(),
					'src'   => array(),
					'alt'   => array(),
				),
				's'      => array(),
				'span'   => array(
					'style' => array(),
					'class' => array(),
				),
				'strong' => array(),
			)
		);

		$font_style = $this->generateFontSizeStyles( $attributes );
		$text_style = $this->generateTextStyles( $attributes );

		$item_link_classes = array_merge(
			[ 'menu-item-link' ],
			[ $font_style['css_classes'] ],
			[ $text_style['css_classes'] ]
		);

		$item_link_style = $font_style['inline_styles'] . $text_style['inline_styles'];
		$is_active = false;
		if( isset( $attributes['kind'] ) && isset( $attributes['id'] ) ){
			$is_active = $attributes['kind'] == 'post-type' && $attributes['id'] === get_the_ID();
		}

		$trigger_type = isset( $attributes['triggerType'] ) ? $attributes['triggerType'] : 'hover';

		$item_classes = array_filter( array_merge(
			[ 'menu-item' ],
			$content ? [ 'has-children' ] : [],
			$content && $trigger_type === 'click' ? [ 'has-click-trigger' ] : [],
			$is_active ? [ 'is-current' ] : [],
		) );

		$item_classes = apply_filters( 'mild-megamenu/blocks/menu-item/item-classes', $item_classes, $attributes );

		$html .= '<li ' . get_block_wrapper_attributes( [ 'class' => implode( ' ', $item_classes ) ] ) . '>';
		$html .= '<div class="' . esc_attr( implode( ' ', $item_link_classes ) ) . '" style="' . esc_attr( $item_link_style ) . '">';
		$html .= '<a href="';
		if ( isset( $attributes['url'] ) ) {
			$html .= esc_url( $attributes['url'] );
		} else {
			$html .= '#';
		}
		$html .= '"';

		if ( isset( $attributes['linkTarget'] ) ) {
			$html .= ' target="' . esc_attr( $attributes['linkTarget'] ) . '"';
		}

		if ( isset( $attributes['rel'] ) ) {
			$html .= ' rel="' . esc_attr( $attributes['rel'] ) . '"';
		}

		$html .= '>' . $attributes['text'] . '</a>';

		if ( trim( $content ) ) {
			$html .= '<button class="menu-item-toggle"><span class="dashicons dashicons-arrow-down"></span></button>';
		}

		$html .= '</div>';

		if ( trim( $content ) ) {
			$alignment = isset( $attributes['dropdownAlignment'] ) ? $attributes['dropdownAlignment'] : 'center';
			$top_offset = isset( $attributes['dropdownTopOffset'] ) ? intval( $attributes['dropdownTopOffset'] ) : 0;
			$dropdown_style = $top_offset !== 0 ? ' style="margin-top: ' . $top_offset . 'px"' : '';
			$html .= '<div class="dropdown-wrapper align-' . esc_attr( $alignment ) . '"' . $dropdown_style . '>';
			$html .= $content;
			$html .= '</div>';
		}

		$html .= '</li>';

		return $html;
	}

	private function generateFontSizeStyles( $attributes ) {
		$font_sizes = array(
			'css_classes'   => '',
			'inline_styles' => '',
		);

		$has_named_font_size  = array_key_exists( 'fontSize', $attributes );
		$has_custom_font_size = array_key_exists( 'customFontSize', $attributes );

		if ( $has_named_font_size ) {
			// Add the font size class.
			$font_sizes['css_classes'] = sprintf( 'has-%s-font-size', $attributes['fontSize'] );
		} elseif ( $has_custom_font_size ) {
			// Add the custom font size inline style.
			$font_size = is_numeric( $attributes['customFontSize'] ) ? $attributes['customFontSize'] . 'px' : $attributes['customFontSize'];
			$font_sizes['inline_styles'] = sprintf( 'font-size: %s;', $font_size );
		}

		return $font_sizes;
	}

	private function generateTextStyles( $attributes ) {
		$colors = array(
			'css_classes'   => '',
			'inline_styles' => '',
		);

		// Text color.
		$has_named_text_color  = array_key_exists( 'textColor', $attributes );
		$has_custom_text_color = array_key_exists( 'customTextColor', $attributes );

		// If has text color.
		if ( $has_custom_text_color || $has_named_text_color ) {
			// Add has-text-color class.
			$colors['css_classes'] .= ' has-text-color';
		}

		if ( $has_named_text_color ) {
			// Add the color class.
			$colors['css_classes'] .= sprintf( ' has-%s-color', $attributes['textColor'] );
		} elseif ( $has_custom_text_color ) {
			// Add the custom color inline style.
			$colors['inline_styles'] .= sprintf( 'color: %s;', $attributes['customTextColor'] );
		}

		return $colors;
	}

	protected function setName() {
		$this->name = 'mild-megamenu/menu-item';
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
