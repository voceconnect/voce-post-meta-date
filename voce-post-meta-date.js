;(function ( $, window, document, undefined ) {

	var defaults = {
		minField: false,
		maxField: false,
		timeField: {},
		dateField: {
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
			this.$dateField.pickadate(this.settings.dateField);
			this.$timeField.pickatime(this.settings.timeField);
			this.$datePicker = this.$dateField.pickadate('picker');
			this.$timePicker = this.$timeField.pickatime('picker');
		},

		handleSettings: function() {
			if ( this.settings.dateField.min ) {
				var timestamp = this.settings.dateField.min;
				this.settings.dateField.min = new Date(timestamp);
			}
			if ( this.settings.dateField.max ) {
				var timestamp = this.settings.dateField.max;
				this.settings.dateField.max = new Date(timestamp);
			}
		},

		listen: function() {
			var _this = this;
			var callbacks = {
				set: function() {
					_this.getNewTime();
				}
			};

			this.$datePicker.on(callbacks);
			this.$timePicker.on(callbacks);

			if ( this.settings.minField ) {
				$minField = $('#'+this.settings.minField);
				$minFieldDate = $minField.parent().find('.datepicker');
				$minFieldDatePicker = $minFieldDate.pickadate('picker');

				$minFieldDatePicker.on( 'set', function() {
					var minDateVal = $minFieldDatePicker.get('select');
					_this.$datePicker.set('min', minDateVal.obj);
				} );
			}

			if ( this.settings.maxField ) {
				$maxField = $('#'+this.settings.maxField);
				$maxFieldDate = $maxField.parent().find('.datepicker');
				$maxFieldDatePicker = $maxFieldDate.pickadate('picker');

				$maxFieldDatePicker.on( 'set', function() {
					var maxDateVal = $maxFieldDatePicker.get('select');
					_this.$datePicker.set('max', maxDateVal.obj);
				} );
			}
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
    	var datetimes = [];
        $('.vpm-datetime').each(function(i, e){
            datetimes.push( new vpmDateTime( this, $(this).data('field-settings') ) );
        });
        $.each( datetimes, function(i, e) {
        	e.listen();
        } );
    });

})( jQuery, window, document );