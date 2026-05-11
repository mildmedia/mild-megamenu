/**
 * External dependencies
 */
import Controls from "./controls";

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	useEffect,
	useRef
} from '@wordpress/element';
import { compose } from '@wordpress/compose';
import { withSelect, withDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import {
	useBlockProps,
	RichText,
	InnerBlocks,
} from '@wordpress/block-editor';

function MenuItemEdit(props) {
	const {
		attributes,
		setAttributes,
		isSelected,
		onReplace,
		mergeBlocks,
		isParentOfSelectedBlock,
		hasDescendants,
		addDropdown,
		removeDropdown,
		rootBlockClientId,
		parentAttributes,
	} = props;

	const { text, dropdownAlignment } = attributes;
	const itemLabelPlaceholder = __('Add link…');
	const isMenuItemSelected = isSelected || isParentOfSelectedBlock;
	const showDropdown = isMenuItemSelected && hasDescendants;
	const menuItem = useRef(null);
	const dropdownWrapper = useRef(null);

	const toggleItemDropdown = () => {
		if (hasDescendants) {
			removeDropdown();
		} else {
			addDropdown();
		}
	};

	useEffect(() => {
		if (!parentAttributes?.expandDropdown || !menuItem.current || !dropdownWrapper.current) return;

		const editorEl = menuItem.current.closest('.is-root-container');
		if (!editorEl) return;

		const calculate = () => {
			const rootGroupEl = editorEl.querySelector('.is-layout-constrained')?.firstElementChild;
			const editorRect = rootGroupEl ? rootGroupEl.getBoundingClientRect() : editorEl.getBoundingClientRect();
			const editorStyles = window.getComputedStyle(editorEl);
			const paddingLeft = parseFloat(editorStyles.paddingLeft) || 0;
			const paddingRight = parseFloat(editorStyles.paddingRight) || 0;

			const containingBlock = dropdownWrapper.current.offsetParent;
			const cbLeft = containingBlock ? containingBlock.getBoundingClientRect().left : 0;

			dropdownWrapper.current.style.left = (editorRect.left + paddingLeft - cbLeft) + 'px';
			dropdownWrapper.current.style.width = (editorRect.width - paddingLeft - paddingRight) - 20 + 'px';

			if (dropdownAlignment === 'item') {
				const content = dropdownWrapper.current.querySelector('.dropdown-content');
				if (content) {
					const itemRect = menuItem.current.getBoundingClientRect();
					const wrapperRect = dropdownWrapper.current.getBoundingClientRect();
					content.style.marginLeft = (itemRect.left - wrapperRect.left) - 10 + 'px';
				}
			}
		};

		const rafId = requestAnimationFrame(calculate);
		const observer = new ResizeObserver(calculate);
		observer.observe(editorEl);
		return () => { cancelAnimationFrame(rafId); observer.disconnect(); };
	}, [parentAttributes?.expandDropdown, showDropdown, dropdownAlignment]);

	const itemClasses = [
		'wp-block-mild-megamenu-item',
		'menu-item',
		hasDescendants && 'has-child',
		showDropdown && 'is-opened',
	].filter(Boolean).join(' ');

	const blockProps = useBlockProps({ className: itemClasses, ref: menuItem });

	const itemLinkClasses = [
		'menu-item-link',
		(attributes.textColor || attributes.customTextColor) && 'has-text-color',
		attributes.textColor && `has-${attributes.textColor}-color`,
		attributes.fontSize && `has-${attributes.fontSize}-font-size`,
	].filter(Boolean).join(' ');

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
						{hasDescendants && parentAttributes?.showDropdownArrow !== false && (
							<span className="menu-item-dropdown-icon">
								<span className="dashicons dashicons-arrow-down"></span>
							</span>
						)}
					</a>
				</div>
				{showDropdown && (
					<div ref={dropdownWrapper} className={`dropdown-wrapper align-${dropdownAlignment || 'center'}`} style={attributes.dropdownTopOffset ? { marginTop: `${attributes.dropdownTopOffset}px` } : undefined}>
						<InnerBlocks
							allowedBlocks={['mild-megamenu/menu-item-dropdown']}
							renderAppender={false}
						/>
					</div>
				)}
			</div>
			<Controls
				{...props}
				toggleItemDropdown={toggleItemDropdown}
				hasDescendants={hasDescendants}
			/>
		</>
	);
}

export default compose([
	withSelect((select, ownProps) => {
		const {
			hasSelectedInnerBlock,
			getBlockParentsByBlockName,
			getBlock,
			getBlocks,
		} = select('core/block-editor');
		const { clientId } = ownProps;
		const isParentOfSelectedBlock = hasSelectedInnerBlock(clientId, true);
		const innerBlocks = getBlocks(clientId);
		const hasDescendants = innerBlocks.some(b => b.name === 'mild-megamenu/menu-item-dropdown');
		const rootBlockClientId = getBlockParentsByBlockName(clientId, 'mild-megamenu/menu')[0];
		const parentAttributes = getBlock(rootBlockClientId).attributes;
		return {
			isParentOfSelectedBlock,
			hasDescendants,
			rootBlockClientId,
			parentAttributes,
		};
	}),
	withDispatch((dispatch, { clientId }) => {
		return {
			addDropdown() {
				const dropdownBlock = createBlock('mild-megamenu/menu-item-dropdown');
				dispatch('core/block-editor').replaceInnerBlocks(clientId, [dropdownBlock], false);
			},
			removeDropdown() {
				dispatch('core/block-editor').replaceInnerBlocks(clientId, [], false);
			},
		};
	}),
])(MenuItemEdit);
