import { __ } from '@wordpress/i18n';
import {
	ToolbarDropdownMenu,
	ToolbarButton,
	ToolbarGroup,
} from '@wordpress/components';

export default function OrientationJustifyControls({ attributes, setAttributes }) {
	function setAlignment(alignment) {
		return () => {
			const itemsJustification =
				attributes.itemsJustification === alignment ? undefined : alignment;
			setAttributes({ itemsJustification });
		};
	}

	function toggleOrientation() {
		setAttributes({
			orientation: attributes.orientation === 'vertical' ? 'horizontal' : 'vertical',
		});
	}

	return (
		<>
			<ToolbarDropdownMenu
				icon={attributes.itemsJustification ? `editor-align${attributes.itemsJustification}` : 'editor-alignleft'}
				label={__('Change items justification')}
				controls={[
					{
						icon: 'editor-alignleft',
						title: __('Justify items left'),
						isActive: 'left' === attributes.itemsJustification,
						onClick: setAlignment('left'),
					},
					{
						icon: 'editor-aligncenter',
						title: __('Justify items center'),
						isActive: 'center' === attributes.itemsJustification,
						onClick: setAlignment('center'),
					},
					{
						icon: 'editor-alignright',
						title: __('Justify items right'),
						isActive: 'right' === attributes.itemsJustification,
						onClick: setAlignment('right'),
					},
				]}
			/>
			<ToolbarGroup>
				<ToolbarButton
					name="orientation"
					icon={attributes.orientation === 'vertical' ? 'arrow-down-alt' : 'arrow-right-alt'}
					title={attributes.orientation === 'vertical' ? __('Make horizontal') : __('Make vertical')}
					isActive={attributes.orientation === 'vertical'}
					onClick={toggleOrientation}
				/>
			</ToolbarGroup>
		</>
	);
}
