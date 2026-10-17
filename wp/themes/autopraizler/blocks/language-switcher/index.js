/* Editor: blok se vykresluje na serveru (render.php), v editoru ukazujeme náhled. */
( function ( wp ) {
	var el = wp.element.createElement;
	var ServerSideRender = wp.serverSideRender;

	wp.blocks.registerBlockType( 'autopraizler/language-switcher', {
		edit: function () {
			var props = wp.blockEditor.useBlockProps();
			return el(
				'div',
				props,
				el( ServerSideRender, { block: 'autopraizler/language-switcher' } )
			);
		},
		save: function () {
			return null;
		},
	} );
} )( window.wp );
