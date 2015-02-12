;(function ( $, window, document, undefined ) {

	var defaults = {
		time: {},
		date: {
			min: undefined,
			max: undefined
		}
	};

	function vpmDateTime ( element, options ) {
		this.$field = $(element);
		this.settings = $.extend( {}, defaults, options );
		this.$dateField = this.$field.parent().find('.datepicker');
		this.$timeField = this.$field.parent().find('.timepicker');
		this.init();
	}

	vpmDateTime.prototype = {

		init: function () {
			this.handleSettings();
			console.log(this.settings);
			this.$dateField.pickadate(this.settings.date);
			this.$timeField.pickatime(this.settings.time);
			this.$datePicker = this.$dateField.pickadate('picker');
			this.$timePicker = this.$timeField.pickatime('picker');
			this.listen();
		},

		handleSettings: function() {
			if ( this.settings.date.min ) {
				var timestamp = this.settings.date.min;
				this.settings.date.min = new Date(timestamp);
			}
			if ( this.settings.date.max ) {
				var timestamp = this.settings.date.max;
				this.settings.date.max = new Date(timestamp);
			}
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