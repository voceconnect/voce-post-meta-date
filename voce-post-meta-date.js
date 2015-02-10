;(function ( $, window, document, undefined ) {

	$(document).ready(function(){
		$( '.datepicker' ).pickadate({
			hiddenName: true,
			formatSubmit: 'yyyy/mm/dd'
		});
		$( '.timepicker' ).pickatime({
			hiddenName: true,
			formatSubmit: 'yyyy/mm/dd'
		});
	});

})( jQuery, window, document );