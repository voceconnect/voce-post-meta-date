;(function ( $, window, document, undefined ) {

	var updateHidden = function( picker ) {
		console.log(picker);
	}

	$(document).ready(function(){

		var callbacks = {
			close: function() {
				var picker = this;
				updateHidden(picker);
			}
		};

		var $datepick = $( '.datepicker' ).pickadate();
		var $datepicker = $datepick.pickadate('picker').on(callbacks);

		var $timepick = $( '.timepicker' ).pickatime();
		var $timepicker = $timepick.pickatime('picker').on(callbacks);

	});

})( jQuery, window, document );