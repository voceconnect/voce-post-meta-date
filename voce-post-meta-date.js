;(function ( $, window, document, undefined ) {

	$(document).ready(function(){
		var $datepick = $( '.datepicker' ).pickadate();
		var $datepicker = $datepick.pickadate('picker').on({
			close: function() {
				console.log(this.get('select'));
			}
		});
		var $timepick = $( '.timepicker' ).pickatime();
		var $timepicker = $timepick.pickatime('picker').on({
			close: function() {
				console.log(this.get('select'));
			}
		});

	});

})( jQuery, window, document );