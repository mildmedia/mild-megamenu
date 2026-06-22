import { registerPlugin } from '@wordpress/plugins';
import { useEffect } from '@wordpress/element';
import { useSelect, dispatch, select } from '@wordpress/data';
import { serialize, parse } from '@wordpress/blocks';
import apiFetch from '@wordpress/api-fetch';

const NOTICE_ID = 'mild-megamenu-getwid-found';

function blockTreeHasGetwid( blocks ) {
	return blocks.some(
		( b ) =>
			( b.name || '' ).startsWith( 'getwid-megamenu/' ) ||
			blockTreeHasGetwid( b.innerBlocks || [] )
	);
}

async function handleConvert() {
	dispatch( 'core/notices' ).removeNotice( NOTICE_ID );
	const currentBlocks = select( 'core/block-editor' ).getBlocks();
	try {
		const response = await apiFetch( {
			path: '/mild-megamenu/v1/convert-content',
			method: 'POST',
			data: { content: serialize( currentBlocks ) },
		} );
		dispatch( 'core/block-editor' ).resetBlocks( parse( response.content ) );
		dispatch( 'core/notices' ).createNotice(
			'success',
			'Konverterat till Mild Mega Menu. Spara inlägget för att bekräfta.',
			{ type: 'snackbar' }
		);
	} catch {
		dispatch( 'core/notices' ).createNotice(
			'error',
			'Konverteringen misslyckades. Försök igen.',
			{ type: 'snackbar' }
		);
	}
}

const GetwIdMigratorPlugin = () => {
	const blocks = useSelect( ( s ) => s( 'core/block-editor' ).getBlocks() );
	const needsConversion = blockTreeHasGetwid( blocks );

	useEffect( () => {
		if ( ! needsConversion ) {
			dispatch( 'core/notices' ).removeNotice( NOTICE_ID );
			return;
		}
		dispatch( 'core/notices' ).createNotice(
			'warning',
			'Det här inlägget innehåller getwid-megamenu-block. Vill du konvertera till Mild Mega Menu?',
			{
				id: NOTICE_ID,
				isDismissible: true,
				actions: [ { label: 'Konvertera', onClick: handleConvert } ],
			}
		);
		return () => dispatch( 'core/notices' ).removeNotice( NOTICE_ID );
	}, [ needsConversion ] ); // eslint-disable-line react-hooks/exhaustive-deps

	return null;
};

registerPlugin( 'mild-megamenu-getwid-migrator', { render: GetwIdMigratorPlugin } );
