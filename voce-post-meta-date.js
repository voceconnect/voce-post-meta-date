;(function ( $, window, document, undefined ) {

	var defaults = {

	};

	function vpmDateTime ( element, options ) {
		this.$field = $(element);
		this.$dateField = this.$field.parent().find('.datepicker');
		this.$timeField = this.$field.parent().find('.timepicker');
		this.init();
	}

	vpmDateTime.prototype = {

		init: function () {
			this.$dateField.pickadate();
			this.$timeField.pickatime();
			this.$datePicker = this.$dateField.pickadate('picker');
			this.$timePicker = this.$timeField.pickatime('picker');
			this.listen();
		},

		listen: function() {
			var _this = this;
			var callbacks = {
				close: function() {
					_this.getNewTime();
				}
			};

			this.$datePicker.on(callbacks);
			this.$timePicker.on(callbacks);
		},

		getNewTime: function() {
			var timestamp = 0;
			var dateVal = this.$datePicker.get('select');
			var timeVal = this.$timePicker.get('select');

			if ( dateVal !== null ) {
				// Convert ms to seconds
				timestamp += dateVal.pick / 1000;
			}

			if ( timeVal !== null ) {
				// Convert min to seconds
				timestamp += timeVal.pick * 60;
			}

			this.updateField(timestamp);
		},

		updateField: function( value ) {
			this.$field.val(value);
		}

	};

    $(document).ready(function(){
        $('.vpm-datetime').each(function(i, e){
            new vpmDateTime( this, $(this).data('field-settings') );
        });
    });

})( jQuery, window, document );