import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';

export default function MenuItemDropdownEdit() {
	const blockProps = useBlockProps({ className: 'dropdown' });
	const allowedBlocks = useSelect((select) =>
		select('core/blocks').getBlockTypes()
			.filter(({ name }) => name !== 'mild-megamenu/menu')
			.map(({ name }) => name)
	);

	return (
		<div {...blockProps}>
			<div className="dropdown-content">
				<InnerBlocks allowedBlocks={allowedBlocks} />
			</div>
		</div>
	);
}
