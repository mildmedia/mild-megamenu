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
	InnerBlocks,
	useBlockProps,
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
		'plainmenu',
		{
			[`justify-items-${attributes.itemsJustification}`]: attributes.itemsJustification,
			[`is-orientation-${attributes.orientation}`]: attributes.orientation
		}
	);

	const blockProps = useBlockProps({ className: menuClasses });

	return (
		<>
			<Controls {...args} />
			<div {...blockProps}>
				<div className="plainmenu__content" style={attributes?.style?.spacing?.blockGap ? { gap: attributes.style.spacing.blockGap.replace(/^var:preset\|spacing\|(.+)$/, 'var(--wp--preset--spacing--$1)') } : undefined}>
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