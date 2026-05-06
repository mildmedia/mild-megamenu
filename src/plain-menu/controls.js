import { __ } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import {
	BlockControls,
	InspectorControls
} from '@wordpress/block-editor';
import {
	PanelBody,
} from '@wordpress/components';
import LinkPaddingControl from '../shared/LinkPaddingControl';
import PageSearchPanel from '../shared/PageSearchPanel';
import OrientationJustifyControls from '../shared/OrientationJustifyControls';

function Controls(args) {
	const {
		clientId,
		setAttributes,
		attributes,
	} = args;

	const { insertBlock } = useDispatch('core/block-editor');

	function addPage(page) {
		insertBlock(
			createBlock('mild-megamenu/plain-menu-item', {
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
			</BlockControls>
			<InspectorControls>
				<PanelBody title={__('Settings')} initialOpen={true}>
					<LinkPaddingControl
						attributes={attributes}
						setAttributes={setAttributes}
					/>
				</PanelBody>
				<PanelBody title={__('Add pages')} initialOpen={false}>
					<PageSearchPanel onAdd={addPage} />
				</PanelBody>
			</InspectorControls>
		</>
	);
}

export default Controls;
