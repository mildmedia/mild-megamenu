import { __ } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
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
	ToolbarButton,
	ToolbarGroup,
} from '@wordpress/components';
import LinkPaddingControl from '../shared/LinkPaddingControl';
import PageSearchPanel from '../shared/PageSearchPanel';
import OrientationJustifyControls from '../shared/OrientationJustifyControls';

function Controls(args) {
	const {
		clientId,
		setAttributes,
		attributes,
		setIsAdjusting,
	} = args;

	const { insertBlock } = useDispatch('core/block-editor');

	function expandDropdown() {
		setAttributes({ expandDropdown: !attributes.expandDropdown });
	}

	function addPage(page) {
		insertBlock(
			createBlock('mild-megamenu/menu-item', {
				url: page.link,
				text: page.title.rendered,
			}),
			undefined,
			clientId,
			false
		);
	}

	return (
		<>
			<BlockControls>
				<OrientationJustifyControls
					attributes={attributes}
					setAttributes={setAttributes}
				/>
				<ToolbarGroup>
					<ToolbarButton
						name="expand"
						icon={attributes.expandDropdown ? 'editor-contract' : 'editor-expand'}
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
					<ToggleControl
						label={__('Show dropdown arrow')}
						checked={attributes.showDropdownArrow !== false}
						onChange={(value) => setAttributes({ showDropdownArrow: value })}
					/>
					<RangeControl
						label={__('Dropdown delay between dropdowns in seconds')}
						value={attributes.delayBetweenDropdowns}
						onChange={(delayBetweenDropdowns) => setAttributes({ delayBetweenDropdowns })}
						min={0}
						max={1.5}
						step={0.05}
					/>
					<LinkPaddingControl
						attributes={attributes}
						setAttributes={setAttributes}
						setIsAdjusting={setIsAdjusting}
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
					<BaseControl label={__('Toggle button alignment')}>
						<ButtonGroup>
							<Button
								icon="editor-alignleft"
								isSecondary
								onClick={() => setAttributes({ toggleButtonAlignment: 'left' })}
								isPrimary={'left' === attributes.toggleButtonAlignment}
							/>
							<Button
								icon="editor-aligncenter"
								isSecondary
								onClick={() => setAttributes({ toggleButtonAlignment: 'center' })}
								isPrimary={'center' === attributes.toggleButtonAlignment}
							/>
							<Button
								icon="editor-alignright"
								isSecondary
								onClick={() => setAttributes({ toggleButtonAlignment: 'right' })}
								isPrimary={'right' === attributes.toggleButtonAlignment}
							/>
						</ButtonGroup>
					</BaseControl>
				</PanelBody>
				<PanelBody title={__('Add pages')} initialOpen={false}>
					<PageSearchPanel onAdd={addPage} />
				</PanelBody>
			</InspectorControls>
		</>
	)
}

export default Controls;
