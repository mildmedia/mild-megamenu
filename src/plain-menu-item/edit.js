import Controls from "./controls";

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { RichText, useBlockProps } from '@wordpress/block-editor';

function MenuItemEdit({ attributes, setAttributes, isSelected, onReplace, mergeBlocks }) {
	const { text } = attributes;
	const blockProps = useBlockProps({ className: 'plainmenu-item' });

	return (
		<>
			<div {...blockProps}>
				<div className="plainmenu-item__link">
					<a>
						<RichText
							placeholder={__('Add link…')}
							value={text}
							onChange={(value) => setAttributes({ text: value })}
							withoutInteractiveFormatting
							onReplace={onReplace}
							onMerge={mergeBlocks}
							identifier="text" />
					</a>
				</div>
			</div>
			<Controls
				isSelected={isSelected}
				attributes={attributes}
				setAttributes={setAttributes}
			/>
		</>
	);
}

export default MenuItemEdit;
