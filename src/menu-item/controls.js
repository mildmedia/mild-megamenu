/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	useCallback,
	useState,
	useEffect
} from '@wordpress/element';
import {
	PanelBody,
	TextControl,
	ToggleControl,
	ToolbarButton,
	ToolbarGroup,
	Popover,
	SelectControl,
} from '@wordpress/components';
import {
	BlockControls,
	InspectorControls,
	__experimentalLinkControl,
} from '@wordpress/block-editor';

const NEW_TAB_REL = 'noreferrer noopener';

function Controls(args) {
	const {
		isSelected,
		attributes,
		setAttributes,
		toggleItemDropdown,
		hasDescendants,
	} = args;

	const {
		linkTarget,
		rel,
		text,
		url
	} = attributes;
	const [isURLPickerOpen, setIsURLPickerOpen] = useState(false);

	const isURLSet = !(url === undefined || url.trim().length === 0);

	const openLinkControl = () => {
		setIsURLPickerOpen(true);
		return false;
	};

	const unlinkItem = () => {
		setAttributes({
			url: undefined,
			linkTarget: undefined,
			rel: undefined,
		});
		setIsURLPickerOpen(false);
	};

	const onToggleOpenInNewTab = useCallback(
		(value) => {
			const newLinkTarget = value ? '_blank' : undefined;

			let updatedRel = rel;
			if (newLinkTarget && !rel) {
				updatedRel = NEW_TAB_REL;
			} else if (!newLinkTarget && rel === NEW_TAB_REL) {
				updatedRel = undefined;
			}

			setAttributes({
				linkTarget: newLinkTarget,
				rel: updatedRel,
			});
		},
		[rel, setAttributes]
	);

	const onSetLinkRel = useCallback(
		(value) => {
			setAttributes({ rel: value });
		},
		[setAttributes]
	);

	useEffect(() => {
		if (isSelected && !url) {
			setIsURLPickerOpen(true);
		}
	}, [isSelected]);

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						name="link"
						icon="admin-links"
						title={__('Edit Link')}
						onClick={openLinkControl}
						isActive={isURLSet} />
					<ToolbarButton
						name="unlink"
						icon="editor-unlink"
						title={__('Unlink')}
						onClick={unlinkItem}
						isDisabled={!isURLSet} />
				</ToolbarGroup>
				<ToolbarGroup>
					<ToolbarButton
						name="submenu"
						icon="download"
						title={__('Add submenu')}
						onClick={toggleItemDropdown}
					/>
				</ToolbarGroup>
			</BlockControls>
			{isURLPickerOpen && (
				<Popover
					position="top center"
					onClose={() => setIsURLPickerOpen(false)}
				>
					<__experimentalLinkControl
						value={{
							url,
							opensInNewTab: linkTarget === '_blank'
						}}
						onChange={({
							title: newTitle = '',
							url: newURL = '',
							opensInNewTab: newOpensInNewTab,
							id: newId = '',
							kind: newKind = '',
						}) => {
							setAttributes({
								id: newId,
								kind: newKind,
								url: newURL,
								text: (() => {
									if (text) {
										return text;
									}
									if (newTitle !== '' && text !== newTitle) {
										return newTitle;
									}
								})()
							});

							if (linkTarget === "_blank" !== newOpensInNewTab) {
								onToggleOpenInNewTab(newOpensInNewTab);
							}

							setIsURLPickerOpen(false);
						}}
					/>
				</Popover>
			)}
			<InspectorControls>
				<PanelBody title={__('Link settings')}>
					<ToggleControl
						label={__('Open in new tab')}
						onChange={onToggleOpenInNewTab}
						checked={linkTarget === '_blank'}
					/>
					<TextControl
						label={__('Link rel')}
						value={rel || ''}
						onChange={onSetLinkRel}
					/>
				</PanelBody>
				{hasDescendants && (
					<PanelBody title={__('Dropdown settings')}>
						<SelectControl
							label={__('Open on')}
							value={attributes.triggerType || 'hover'}
							options={[
								{ label: __('Hover'), value: 'hover' },
								{ label: __('Click'), value: 'click' },
							]}
							onChange={(triggerType) => setAttributes({ triggerType })}
						/>
						<SelectControl
							label={__('Content alignment')}
							value={attributes.dropdownAlignment || 'center'}
							options={[
								{ label: __('Left'), value: 'left' },
								{ label: __('Center'), value: 'center' },
								{ label: __('Right'), value: 'right' },
								{ label: __('Align to item'), value: 'item' },
							]}
							onChange={(dropdownAlignment) => setAttributes({ dropdownAlignment })}
						/>
					</PanelBody>
				)}
			</InspectorControls>
		</>
	);
}

export default Controls;
