import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import metadata from './block.json';
import save from './save';
import edit from './edit';

registerBlockType(metadata.name, {
	title: __('Mega Menu', 'mild-megamenu'),
	keywords: [
		__('navigation', 'mild-megamenu'),
		__('links', 'mild-megamenu')
	],
	icon: 'welcome-widgets-menus',
	category: metadata.category,
	attributes: metadata.attributes,
	supports: metadata.supports,
	edit,
	save
});
