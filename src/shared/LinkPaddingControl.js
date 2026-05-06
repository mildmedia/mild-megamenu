import { __ } from '@wordpress/i18n';
import { RangeControl } from '@wordpress/components';

export default function LinkPaddingControl({ attributes, setAttributes, setIsAdjusting }) {
	function setLinkPadding(value, dimension) {
		const numValue = value !== undefined && value !== '' ? Number(value) : undefined;
		setAttributes({ [dimension === 'horizontal' ? 'linkPaddingHorizontal' : 'linkPaddingVertical']: numValue });
	}

	return (
		<>
			<RangeControl
				label={__('Link padding x')}
				value={attributes.linkPaddingHorizontal ?? 0}
				onChange={(value) => setLinkPadding(value, 'horizontal')}
				onFocus={() => setIsAdjusting?.(true)}
				onBlur={() => setIsAdjusting?.(false)}
				min={0}
				max={50}
			/>
			<RangeControl
				label={__('Link padding y')}
				value={attributes.linkPaddingVertical ?? 0}
				onChange={(value) => setLinkPadding(value, 'vertical')}
				onFocus={() => setIsAdjusting?.(true)}
				onBlur={() => setIsAdjusting?.(false)}
				min={0}
				max={50}
			/>
		</>
	);
}
