import { __ } from '@wordpress/i18n';
import {
	BlockControls,
	InspectorControls
} from '@wordpress/block-editor';
import {
	BaseControl,
	ButtonGroup,
	Button,
	PanelBody,
	RangeControl,
	ToggleControl,
	ToolbarDropdownMenu,
	ToolbarButton,
	ToolbarGroup
} from '@wordpress/components';

function Controls(args) {
	const {
		setAttributes,
		attributes,
		updateChildBlocksAttributes,
		setIsAdjusting,
	} = args;

	function setAlignment(alignment) {
		return () => {
			const itemsJustification =
				attributes.itemsJustification === alignment ? undefined : alignment;
			setAttributes({
				itemsJustification,
			});
		}
	}

	function setLinkPadding(value, dimension) {
		const numValue = value !== undefined && value !== '' ? Number(value) : undefined;
		const attributeName = dimension === 'horizontal' ? 'linkPaddingHorizontal' : 'linkPaddingVertical';
		setAttributes({ [attributeName]: numValue });
	}

	function expandDropdown() {
		setAttributes({
			expandDropdown: !attributes.expandDropdown,
		});
	}

	return (
		<>
			<BlockControls>
				<ToolbarDropdownMenu
					icon={attributes.itemsJustification ? `editor-align${attributes.itemsJustification}` : "editor-alignleft"}
					label={__('Change items justification')}
					controls={[
						{
							icon: "editor-alignleft",
							title: __('Justify items left'),
							isActive: 'left' === attributes.itemsJustification,
							onClick: setAlignment('left'),
						},
						{
							icon: "editor-aligncenter",
							title: __('Justify items center'),
							isActive:
								'center' === attributes.itemsJustification,
							onClick: setAlignment('center'),
						},
						{
							icon: "editor-alignright",
							title: __('Justify items right'),
							isActive: 'right' === attributes.itemsJustification,
							onClick: setAlignment('right'),
						},
					]}
				/>
				<ToolbarGroup>
					<ToolbarButton
						name="expand"
						icon={attributes.expandDropdown ? "editor-contract" : "editor-expand"}
						title={__('Expand dropdown')}
						onClick={expandDropdown}
					/>
				</ToolbarGroup>
			</BlockControls>
			<InspectorControls>
				<PanelBody title={__('Settings')} initialOpen={true}>
					<ToggleControl
						label={__('Expand dropdown')}
						help={attributes.expandDropdown ? __('Dropdown width same as window width.') : __('Dropdown width same as menu width.')}
						checked={attributes.expandDropdown}
						onChange={expandDropdown}
					/>
					<RangeControl
						label={__('Link padding x')}
						value={attributes.linkPaddingHorizontal ?? 0}
						onChange={(value) => setLinkPadding(value, 'horizontal')}
						onFocus={() => setIsAdjusting(true)}
						onBlur={() => setIsAdjusting(false)}
						min={0}
						max={50}
					/>
					<RangeControl
						label={__('Link padding y')}
						value={attributes.linkPaddingVertical ?? 0}
						onChange={(value) => setLinkPadding(value, 'vertical')}
						onFocus={() => setIsAdjusting(true)}
						onBlur={() => setIsAdjusting(false)}
						min={0}
						max={50}
					/>
				</PanelBody>
				<PanelBody title={__('Responsive Settings')} initialOpen={false}>
					<RangeControl
						label={__('Mobile device breakpoint in pixels')}
						value={attributes.responsiveBreakpoint}
						onChange={(responsiveBreakpoint) => setAttributes({ responsiveBreakpoint })}
						min={0}
						max={2000}
					/>
					<ToggleControl
						label={__('Collapse on mobile?')}
						help={attributes.collapseOnMobile ? __('Menu will be transformed to burger.') : __('Menu will be as it is.')}
						checked={attributes.collapseOnMobile}
						onChange={(collapseOnMobile) => setAttributes({ collapseOnMobile })}
					/>
					<BaseControl
						label={__('Toggle button alignment')}
					>
						<ButtonGroup>
							<Button
								icon="editor-alignleft"
								isSecondary
								onClick={() => { setAttributes({ toggleButtonAlignment: 'left' }) }}
								isPrimary={'left' === attributes.toggleButtonAlignment}
							/>
							<Button
								icon="editor-aligncenter"
								isSecondary
								onClick={() => { setAttributes({ toggleButtonAlignment: 'center' }) }}
								isPrimary={'center' === attributes.toggleButtonAlignment}
							/>
							<Button
								icon="editor-alignright"
								isSecondary
								onClick={() => { setAttributes({ toggleButtonAlignment: 'right' }) }}
								isPrimary={'right' === attributes.toggleButtonAlignment}
							/>
						</ButtonGroup>
					</BaseControl>
				</PanelBody>
			</InspectorControls>

		</>
	)
}

export default Controls;
