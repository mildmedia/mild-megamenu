<?php

namespace Mild\Plugins\MegaMenu;

class GetwidMigrator {

	private static array $block_map = [
		'getwid-megamenu/menu'            => 'mild-megamenu/menu',
		'getwid-megamenu/menu-item'       => 'mild-megamenu/menu-item',
		'getwid-megamenu/plain-menu'      => 'mild-megamenu/plain-menu',
		'getwid-megamenu/plain-menu-item' => 'mild-megamenu/plain-menu-item',
	];

	// getwid-specific attributes not present in mild-megamenu
	private static array $strip_attrs = [
		'getwid-megamenu/menu'            => [ 'menuItemColor', 'uniqueCSSClass', 'dropdownMaxWidth', 'dropdownContentMaxWidth', 'menuMaxWidth' ],
		'getwid-megamenu/menu-item'       => [ 'uniqueCSSClass' ],
		'getwid-megamenu/plain-menu'      => [ 'uniqueCSSClass' ],
		'getwid-megamenu/plain-menu-item' => [ 'uniqueCSSClass' ],
	];

	public static function convert_content( string $content ): string {
		$blocks    = \parse_blocks( $content );
		$converted = array_map( [ self::class, 'convert_block' ], $blocks );
		return \serialize_blocks( $converted );
	}

	public static function convert_block( array $block ): array {
		$original_name = $block['blockName'] ?? '';

		// Strip getwid-specific attrs before renaming
		if ( isset( self::$strip_attrs[ $original_name ] ) ) {
			foreach ( self::$strip_attrs[ $original_name ] as $attr ) {
				unset( $block['attrs'][ $attr ] );
			}
		}

		// Rename block
		if ( isset( self::$block_map[ $original_name ] ) ) {
			$block['blockName'] = self::$block_map[ $original_name ];
		}

		// Recursively convert inner blocks
		$converted_inner = array_map( [ self::class, 'convert_block' ], $block['innerBlocks'] ?? [] );

		// getwid menu-item puts dropdown content directly as inner blocks.
		// mild-megamenu requires a menu-item-dropdown wrapper block.
		if ( $block['blockName'] === 'mild-megamenu/menu-item' && ! empty( $converted_inner ) ) {
			$dropdown = [
				'blockName'    => 'mild-megamenu/menu-item-dropdown',
				'attrs'        => [],
				'innerBlocks'  => $converted_inner,
				'innerHTML'    => '',
				'innerContent' => array_fill( 0, count( $converted_inner ), null ),
			];
			$block['innerBlocks']  = [ $dropdown ];
			$block['innerHTML']    = '';
			$block['innerContent'] = [ null ];
		} elseif ( ! empty( $converted_inner ) ) {
			$block['innerBlocks'] = $converted_inner;
		}

		return $block;
	}

	public static function find_posts(): array {
		global $wpdb;
		return $wpdb->get_col(
			"SELECT ID FROM {$wpdb->posts}
			 WHERE post_content LIKE '%getwid-megamenu/%'
			 AND post_type != 'revision'
			 AND post_status NOT IN ('trash', 'auto-draft')"
		);
	}

	public static function register_rest_route(): void {
		\register_rest_route( 'mild-megamenu/v1', '/convert-content', [
			'methods'             => 'POST',
			'callback'            => [ self::class, 'rest_convert_content' ],
			'permission_callback' => fn() => \current_user_can( 'edit_posts' ),
			'args'                => [
				'content' => [ 'type' => 'string', 'required' => true ],
			],
		] );
	}

	public static function rest_convert_content( \WP_REST_Request $request ): \WP_REST_Response {
		$converted = self::convert_content( $request->get_param( 'content' ) );
		return new \WP_REST_Response( [ 'content' => $converted ], 200 );
	}

	public static function convert_post( int $post_id ): bool {
		$post = \get_post( $post_id );
		if ( ! $post || strpos( $post->post_content, 'getwid-megamenu/' ) === false ) {
			return false;
		}

		$new_content = self::convert_content( $post->post_content );

		\wp_update_post( [
			'ID'           => $post_id,
			'post_content' => $new_content,
		] );

		return true;
	}
}
