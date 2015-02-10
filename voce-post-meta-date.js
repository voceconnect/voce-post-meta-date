;(function ( $, window, document, undefined ) {

	$(document).ready(function(){
		$datepick = $( '.datepicker' ).pickadate();
		$timepick = $( '.timepicker' ).pickatime();

		$datepick.on( 'change', function() {
			console.log(this);
		} );
	});

})( jQuery, window, document );