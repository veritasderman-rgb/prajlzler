/* Tlačítko "Vytisknout" na kartě pro recepce (odkaz s třídou ap-print). */
document.addEventListener( 'click', function ( event ) {
	var link = event.target.closest( '.ap-print a, a.ap-print' );
	if ( link ) {
		event.preventDefault();
		window.print();
	}
} );
