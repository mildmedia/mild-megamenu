/**
 * External dependencies
 */
import clsx from 'clsx';
import Controls from "./controls";

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { compose } from '@wordpress/compose';
import { withSelect, withDispatch } from '@wordpress/data';
import { RichText, InnerBlocks } from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';

function MenuItemEdit(props) {
	const {
		attributes,
		setAttributes,
		isSelected,
		onReplace,
		mergeBlocks,
		isParentOfSelectedBlock,
		isImmediateParentOfSelectedBlock,
		hasDescendants,
		insertPlainMenuItem,
		selectedBlockHasDescendants,
		parentAttributes,
		parentItemClientId
	} = props;
	const {
		text,
	} = attributes;

	const itemLabelPlaceholder = __('Add link…');

	const [isItemDropdownOpened, setIsItemDropdownOpened] = useState(hasDescendants);

	const isMenuItemSelected = isSelected || isParentOfSelectedBlock;
	const menuItemHasChildrens = isItemDropdownOpened || hasDescendants;
	const showDropdown = isMenuItemSelected && menuItemHasChildrens;

	const itemClasses = clsx(
		'wp-block-mild-plain-menu-item',
		'plainmenu-item',
		{
			'has-child': hasDescendants,
			'has-child-selected': isParentOfSelectedBlock,
			'is-opened': showDropdown
		}
	);

	useEffect(() => {
		setAttributes({
			fontSize: parentItemClientId ? undefined : parentAttributes.menuItemFontSize,
			customFontSize: parentItemClientId ? undefined : parentAttributes.customMenuItemFontSize,
			textColor: parentItemClientId ? undefined : parentAttributes.menuItemColor,
			customTextColor: parentItemClientId ? undefined : parentAttributes.customMenuItemColor,
		});
	}, []);

	const itemLinkClasses = clsx(
		'plainmenu-item__link',
		{
			'has-text-color': attributes.textColor || attributes.customTextColor,
			[`has-${attributes.textColor}-color`]: !!attributes.textColor,
			[`has-${attributes.fontSize}-font-size`]: !!attributes.fontSize
		}
	);

	const itemLinkStyles = {
		color: attributes.customTextColor,
		fontSize: attributes.customFontSize
	};

	return (
		<>
			<div className={itemClasses}>
				<div className={itemLinkClasses} style={itemLinkStyles}>
					<a
						href="#"
						onClick={() => {
							return false;
						}}
					>
						<RichText
							placeholder={itemLabelPlaceholder}
							value={text}
							onChange={(value) => setAttributes({ text: value })}
							withoutInteractiveFormatting
							onReplace={onReplace}
							onMerge={mergeBlocks}
							identifier="text" />
						{
							(menuItemHasChildrens) && (
								<span className="plainmenu-item__dropdown-icon">
									<span className="dashicons dashicons-arrow-down"></span>
								</span>
							)
						}
					</a>
				</div>
				{
					(isMenuItemSelected) && (
						<div className='plainmenu-item__dropdown'>
							<div className='plainmenu-item__dropdown-content'>
								<InnerBlocks
									allowedBlocks={['mild-megamenu/plain-menu-item']}
									renderAppender={(isSelected && hasDescendants) ||
										(isImmediateParentOfSelectedBlock &&
											!selectedBlockHasDescendants)
										? InnerBlocks.DefaultAppender
										: false}
								/>
							</div>
						</div>
					)
				}
			</div>
			<Controls
				{...props}
				insertPlainMenuItem={insertPlainMenuItem}
			/>
		</>
	);
}

export default compose([
	withSelect((select, ownProps) => {
		const {
			hasSelectedInnerBlock,
			getClientIdsOfDescendants,
			getBlockParentsByBlockName,
			getSelectedBlockClientId,
			getBlock
		} = select('core/block-editor');
		const { clientId } = ownProps;
		const isParentOfSelectedBlock = hasSelectedInnerBlock(clientId, true);
		const isImmediateParentOfSelectedBlock = hasSelectedInnerBlock(
			clientId,
			false
		);
		const hasDescendants = !!getClientIdsOfDescendants([clientId])
			.length;
		const selectedBlockId = getSelectedBlockClientId();
		const selectedBlockHasDescendants = !!getClientIdsOfDescendants([
			selectedBlockId,
		])?.length;
		const rootBlockClientId = getBlockParentsByBlockName(clientId, 'mild-megamenu/plain-menu')[0];
		const parentItemClientId = getBlockParentsByBlockName(clientId, 'mild-megamenu/plain-menu-item')[0];

		const parentAttributes = getBlock(rootBlockClientId).attributes;

		return {
			isParentOfSelectedBlock,
			isImmediateParentOfSelectedBlock,
			selectedBlockHasDescendants,
			hasDescendants,
			rootBlockClientId,
			clientId,
			parentAttributes,
			parentItemClientId
		};
	}),
	withDispatch((dispatch, ownProps, registry) => {
		return {
			clearInnerBlocks(blocks) {
				dispatch('core/block-editor').replaceInnerBlocks(
					ownProps.clientId,
					[],
					false
				);
			},
			insertPlainMenuItem() {
				const { insertBlock } = dispatch('core/block-editor');

				const { getClientIdsOfDescendants } = registry.select(
					'core/block-editor'
				);
				const navItems = getClientIdsOfDescendants([ownProps.clientId]);
				const insertionPoint = navItems.length ? navItems.length : 0;

				const blockToInsert = createBlock('mild-megamenu/plain-menu-item');

				insertBlock(blockToInsert, insertionPoint, ownProps.clientId);
			},
		};
	}),
])(MenuItemEdit);
