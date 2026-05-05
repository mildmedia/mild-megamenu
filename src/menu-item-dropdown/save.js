import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save() {
	return (
		<div {...useBlockProps.save({ className: 'dropdown' })}>
			<div className="dropdown-content">
				<InnerBlocks.Content />
			</div>
		</div>
	);
}
