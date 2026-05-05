import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import metadata from './block.json';
import save from './save';
import edit from './edit';

registerBlockType(metadata.name, {
	apiVersion: metadata.apiVersion,
	title: __('Menu Item Dropdown', 'mild-megamenu'),
	icon: 'arrow-down-alt2',
	category: metadata.category,
	parent: metadata.parent,
	supports: metadata.supports,
	edit,
	save
});
