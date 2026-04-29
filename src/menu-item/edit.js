/**
 * External dependencies
 */
import clsx from 'clsx';
import Controls from "./controls";

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	useState,
	useEffect,
	useRef
} from '@wordpress/element';
import { compose } from '@wordpress/compose';
import { withSelect, withDispatch } from '@wordpress/data';
import {
	useBlockProps,
	RichText,
	InnerBlocks,
} from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
function MenuItemEdit(props) {
	const {
		attributes,
		setAttributes,
		isSelected,
		onReplace,
		mergeBlocks,
		isParentOfSelectedBlock,
		hasDescendants,
		updateInnerBlocks,
		rootBlockClientId,
		parentAttributes
	} = props;
	const {
		text,
	} = attributes;

	const itemLabelPlaceholder = __('Add link…');
	const [isItemDropdownOpened, setIsItemDropdownOpened] = useState(hasDescendants);
	const isMenuItemSelected = isSelected || isParentOfSelectedBlock;
	const menuItemHasChildrens = isItemDropdownOpened || hasDescendants;
	const showDropdown = isMenuItemSelected && menuItemHasChildrens;
	const [dropdownPosition, setDropdownPosition] = useState({ left: 0, width: 'auto' });
	const menuItem = useRef(null);

	const toggleItemDropdown = () => {
		setIsItemDropdownOpened(!isItemDropdownOpened);
		if (hasDescendants) {
			updateInnerBlocks();
		}
		return false;
	};

	const updateDropdownPosition = () => {
		let newDropdownPosition = {};
		let rootBlockNode;
		const blockNode = menuItem.current;

		if (!blockNode) {
			return;
		}

		const blockCoords = blockNode.getBoundingClientRect();

		if (parentAttributes.expandDropdown) {
			rootBlockNode = blockNode.closest('.editor-styles-wrapper');
		} else {
			const dataBlockEl = blockNode.closest('[data-block="' + rootBlockClientId + '"]');
			rootBlockNode = dataBlockEl.querySelector('.wp-block-mild-megamenu') || dataBlockEl;
		}

		const rootCoords = rootBlockNode.getBoundingClientRect();

		let left = -(blockCoords.x - rootCoords.x);

		if (parentAttributes.dropdownMaxWidth && rootCoords.width > parentAttributes.dropdownMaxWidth) {
			left = left + (rootCoords.width - parentAttributes.dropdownMaxWidth) / 2;
		}

		newDropdownPosition = { left: left, width: rootCoords.width };

		if (newDropdownPosition.left !== dropdownPosition.left
			|| newDropdownPosition.width !== dropdownPosition.width) {
			setDropdownPosition(newDropdownPosition);
		}
	};

	useEffect(() => {
		updateDropdownPosition();
	}, [isSelected]);

	useEffect(() => {
		const blockNode = menuItem.current;
		if (blockNode) {
			blockNode.ownerDocument.defaultView.addEventListener('resize', updateDropdownPosition);
		}
	}, []);

	const dropdownWrapperStyle = {
		left: dropdownPosition.left,
		width: dropdownPosition.width,
		maxWidth: parentAttributes.dropdownMaxWidth
	};

	const dropdownStyle = {
		backgroundColor: attributes.customDropdownBackgroundColor
	};

	const dropdownContentStyle = {
		maxWidth: parentAttributes.dropdownContentMaxWidth
	};

	const dropdownClasses = 'test';

	const itemClasses = clsx(
		'wp-block-mild-megamenu-item',
		'megamenu-item',
		{
			'has-child': hasDescendants,
			'is-opened': showDropdown
		}
	);

	const blockProps = useBlockProps({ className: itemClasses, ref: menuItem });

	const itemLinkClasses = clsx(
		'megamenu-item__link',
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
			<div {...blockProps}>
				<div className={itemLinkClasses} style={itemLinkStyles}>
					<a>
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
								<span className="megamenu-item__dropdown-icon">
									<span className="dashicons dashicons-arrow-down"></span>
								</span>
							)
						}
					</a>
				</div>
				{
					(showDropdown) && (
						<div className='megamenu-item__dropdown-wrapper' style={dropdownWrapperStyle}>
							<div className={dropdownClasses} style={dropdownStyle}>
								<div className='megamenu-item__dropdown-content' style={dropdownContentStyle}>
									<InnerBlocks />
								</div>
							</div>
						</div>
					)
				}
			</div>
			<Controls
				{...props}
				toggleItemDropdown={toggleItemDropdown}
				isItemDropdownOpened={isItemDropdownOpened}
			/>
		</>
	);
}

export default compose([
	withSelect((select, ownProps) => {
		const {
			hasSelectedInnerBlock,
			getBlockCount,
			getBlockParentsByBlockName,
			getBlock
		} = select('core/block-editor');
		const { clientId } = ownProps;
		const isParentOfSelectedBlock = hasSelectedInnerBlock(clientId, true);
		const hasDescendants = !!getBlockCount(clientId);
		const rootBlockClientId = getBlockParentsByBlockName(clientId, 'mild-megamenu/menu')[0];

		const parentAttributes = getBlock(rootBlockClientId).attributes;

		return {
			isParentOfSelectedBlock,
			hasDescendants,
			rootBlockClientId,
			parentAttributes
		};
	}),
	withDispatch((dispatch, { clientId }) => {
		return {
			updateInnerBlocks(blocks) {
				dispatch('core/block-editor').replaceInnerBlocks(
					clientId,
					[],
					false
				);
			},
		};
	}),
])(MenuItemEdit);
