<?php


namespace Mild\Plugins\MegaMenu;


class PlainMenuItem extends AbstractBlock {

	public function __construct() {
		parent::__construct();
	}

	public function render_callback( $attributes, $content, $block = null ) {
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
				),
				'strong' => array(),
			)
		);

		$is_active = false;
		if ( isset( $attributes['kind'] ) && isset( $attributes['id'] ) ) {
			$is_active = $attributes['kind'] == 'post-type' && $attributes['id'] === get_the_ID();
		}

		$item_classes = array_merge(
			[ 'wp-block-mild-plain-menu-item' ],
			[ 'plainmenu-item' ],
			$is_active ? [ 'is-current' ] : [],
			isset( $attributes['className'] ) ? [ $attributes['className'] ] : []
		);

		$item_classes = apply_filters( 'mild-megamenu/blocks/plain-menu-item/item-classes', $item_classes, $attributes );

		$font_size = $this->generateFontSizeStyles( $attributes );
		$colors    = $this->generateTextStyles( $attributes );

		$item_link_classes = array_merge(
			[ 'plainmenu-item__link' ],
			[ $font_size['css_classes'] ],
			[ $colors['css_classes'] ]
		);

		$item_link_style = ' style="' . esc_attr( $font_size['inline_styles'] ) . esc_attr( $colors['inline_styles'] ) . '" ';

		$html .= '<li class="' . esc_attr( implode( ' ', $item_classes ) ) . '">';
		$html .= '<div class="' . esc_attr( implode( ' ', $item_link_classes ) ) . '" ' . $item_link_style . '>';
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
		$html .= '</div>';
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
			$font_sizes['css_classes'] = sprintf( 'has-%s-font-size', $attributes['fontSize'] );
		} elseif ( $has_custom_font_size ) {
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

		$has_named_text_color  = array_key_exists( 'textColor', $attributes );
		$has_custom_text_color = array_key_exists( 'customTextColor', $attributes );

		if ( $has_custom_text_color || $has_named_text_color ) {
			$colors['css_classes'] .= ' has-text-color';
		}

		if ( $has_named_text_color ) {
			$colors['css_classes'] .= sprintf( ' has-%s-color', $attributes['textColor'] );
		} elseif ( $has_custom_text_color ) {
			$colors['inline_styles'] .= sprintf( 'color: %s;', $attributes['customTextColor'] );
		}

		return $colors;
	}

	protected function setName() {
		$this->name = 'mild-megamenu/plain-menu-item';
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
