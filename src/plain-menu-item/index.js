import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import metadata from './block.json';
import save from './save';
import edit from './edit';

registerBlockType(metadata.name, {
	title: __('Plain Menu Item', 'mild-megamenu'),
	icon: 'admin-links',
	category: metadata.category,
	parent: metadata.parent,
	attributes: metadata.attributes,
	supports: metadata.supports,
	edit,
	save
});
