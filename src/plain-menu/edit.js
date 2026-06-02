/**
 * External dependencies
 */
import Controls from './controls';

/**
 * WordPress dependencies
 */
import {
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
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

	const menuClasses = [
		'plainmenu',
		attributes.itemsJustification && `justify-items-${attributes.itemsJustification}`,
		attributes.orientation && `is-orientation-${attributes.orientation}`,
	].filter(Boolean).join(' ');

	const blockProps = useBlockProps({ className: menuClasses });

	const gapStyle = attributes?.style?.spacing?.blockGap
		? { gap: attributes.style.spacing.blockGap.replace(/^var:preset\|spacing\|(.+)$/, 'var(--wp--preset--spacing--$1)') }
		: undefined;

	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'plainmenu__content', style: gapStyle },
		{
			template: TEMPLATE,
			templateLock: false,
			allowedBlocks: ALLOWED_BLOCKS,
			templateInsertUpdatesSelection: false,
			renderAppender:
				(isImmediateParentOfSelectedBlock && !selectedBlockHasDescendants) || isSelected
					? InnerBlocks.DefaultAppender
					: false,
			__experimentalMoverDirection: attributes.orientation,
			orientation: attributes.orientation,
		}
	);

	return (
		<>
			<Controls {...args} />
			<div {...blockProps}>
				<div {...innerBlocksProps} />
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