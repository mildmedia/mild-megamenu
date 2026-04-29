/**
 * External dependencies
 */
import clsx from 'clsx';
import Controls from './controls';

/**
 * WordPress dependencies
 */
import { useRef } from '@wordpress/element';
import {
	InnerBlocks
} from '@wordpress/block-editor';
import { withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';

const TEMPLATE = [
	['mild-megamenu/plain-menu-item', {}],
];
const ALLOWED_BLOCKS = [
	'mild-megamenu/plain-menu-item',
];

function PlainMenu(args) {
	const {
		selectedBlockHasDescendants,
		isImmediateParentOfSelectedBlock,
		isSelected,
		attributes
	} = args;

	const ref = useRef();

	const menuClasses = clsx(
		'wp-block-mild-plain-menu',
		'megamenu',
		{
			[`justify-items-${attributes.itemsJustification}`]: attributes.itemsJustification,
			[`is-orientation-${attributes.orientation}`]: attributes.orientation
		}
	);

	return (
		<>
			<Controls {...args} />
			<div className={menuClasses}>
				<div className="megamenu__content">
					<InnerBlocks
						ref={ref}
						template={TEMPLATE}
						templateLock={false}
						allowedBlocks={ALLOWED_BLOCKS}
						templateInsertUpdatesSelection={false}
						renderAppender={
							(isImmediateParentOfSelectedBlock &&
								!selectedBlockHasDescendants) ||
								isSelected
								? InnerBlocks.DefaultAppender
								: false
						}
						__experimentalMoverDirection={attributes.orientation}
						orientation={attributes.orientation}
					/>
				</div>
			</div>
		</>
	);
}

export default compose([
	withSelect((select, { clientId }) => {
		const {
			getClientIdsOfDescendants,
			hasSelectedInnerBlock,
			getSelectedBlockClientId,
		} = select('core/block-editor');
		const isImmediateParentOfSelectedBlock = hasSelectedInnerBlock(
			clientId,
			false
		);
		const selectedBlockId = getSelectedBlockClientId();
		const selectedBlockHasDescendants = !!getClientIdsOfDescendants([
			selectedBlockId,
		])?.length;
		return {
			isImmediateParentOfSelectedBlock,
			selectedBlockHasDescendants
		};
	}),
])(PlainMenu);