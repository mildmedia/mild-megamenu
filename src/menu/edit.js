/**
 * External dependencies
 */
import clsx from 'clsx';
import Controls from './controls';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useRef } from '@wordpress/element';
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

	const menuClasses = clsx(
		'wp-block-mild-megamenu',
		'megamenu',
		{
			[`justify-items-${attributes.itemsJustification}`]: attributes.itemsJustification,
			[`has-full-width-dropdown`]: attributes.expandDropdown,
		}
	);

	const blockProps = useBlockProps({ className: menuClasses });

	const menuWrapperStyle = {
		maxWidth: attributes.menuMaxWidth
	};

	return (
		<>
			<Controls {...args} />
			<div {...blockProps}>
				<div className="megamenu__wrapper" style={menuWrapperStyle}>
					<div className="megamenu__content-wrapper">
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
								__experimentalMoverDirection="horizontal"
								orientation="horizontal"
							/>
						</div>
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
