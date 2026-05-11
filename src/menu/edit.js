/**
 * External dependencies
 */
import Controls from './controls';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useRef, useState } from '@wordpress/element';
import {
	useBlockProps,
	InnerBlocks
} from '@wordpress/block-editor';
import { withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';

const TEMPLATE = [
	['mild-megamenu/menu-item', {}],
];

const ALLOWED_BLOCKS = [
	'mild-megamenu/menu-item'
];

function MegaMenu(args) {
	const {
		selectedBlockHasDescendants,
		isImmediateParentOfSelectedBlock,
		isSelected,
		attributes,
	} = args;

	const ref = useRef();
	const [isAdjusting, setIsAdjusting] = useState(false);

	const menuClasses = [
		'wp-block-mild-megamenu',
		'megamenu',
		attributes.itemsJustification && `justify-items-${attributes.itemsJustification}`,
		attributes.expandDropdown && 'has-full-width-dropdown',
		attributes.orientation === 'vertical' && 'is-orientation-vertical',
		isAdjusting && 'is-adjusting',
	].filter(Boolean).join(' ');

	const blockProps = useBlockProps({ className: menuClasses });
	const blockId = blockProps.id;

	const h = attributes.linkPaddingHorizontal;
	const v = attributes.linkPaddingVertical;
	const linkPaddingCSS = (h != null || v != null)
		? `#${blockId} .menu-item-link>a{padding:${v ?? 0}px ${h ?? 0}px}`
		: null;

	return (
		<>
			<Controls {...args} setIsAdjusting={setIsAdjusting} />
			{linkPaddingCSS && <style>{linkPaddingCSS}</style>}
			<div {...blockProps}>
				<div className="megamenu-wrapper">
					<div className="megamenu-content" style={attributes?.style?.spacing?.blockGap ? { gap: attributes.style.spacing.blockGap.replace(/^var:preset\|spacing\|(.+)$/, 'var(--wp--preset--spacing--$1)') } : undefined}>
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
							__experimentalMoverDirection="horizontal"
							orientation="horizontal"
						/>
					</div>
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
			getBlocksByClientId
		} = select('core/block-editor');
		const isImmediateParentOfSelectedBlock = hasSelectedInnerBlock(
			clientId,
			false
		);
		const selectedBlockId = getSelectedBlockClientId();
		const selectedBlockHasDescendants = !!getClientIdsOfDescendants([
			selectedBlockId,
		])?.length;
		const menuItems = getBlocksByClientId(clientId)[0].innerBlocks;

		return {
			isImmediateParentOfSelectedBlock,
			selectedBlockHasDescendants,
			menuItems
		};
	}),
])(MegaMenu);
