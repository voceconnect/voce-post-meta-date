;(function ( $, window, document, undefined ) {

	var defaults = {
		minField: false,
		maxField: false,
		timeArgs: {},
		dateArgs: {
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
			this.initSettings();
			this.$dateField.pickadate(this.settings.dateArgs);
			this.$timeField.pickatime(this.settings.timeArgs);
			this.$datePicker = this.$dateField.pickadate('picker');
			this.$timePicker = this.$timeField.pickatime('picker');
			this.initListen();
			this.initConnected();
		},

		initSettings: function() {
			if ( this.settings.dateArgs.min ) {
				var timestamp = this.settings.dateArgs.min;
				this.settings.dateArgs.min = new Date(timestamp);
			}
			if ( this.settings.dateArgs.max ) {
				var timestamp = this.settings.dateArgs.max;
				this.settings.dateArgs.max = new Date(timestamp);
			}
		},

		initListen: function() {
			var _this = this;
			var callbacks = {
				set: function() {
					_this.getNewTime();
				}
			};

			this.$datePicker.on(callbacks);
			this.$timePicker.on(callbacks);
		},

		initConnected: function() {
			if ( this.settings.minField ) {
				minID = this.settings.minField;
				this.connectedMin = this.getConnectedField(minID);
			}

			if ( this.settings.maxField ) {
				maxID = this.settings.maxField;
				this.connectedMax = this.getConnectedField(maxID);
			}
		},

		initMinMax: function() {
			var _this = this;

			if ( this.settings.minField ) {
				$minPicker = this.getConnectedPicker(this.settings.minField);
				if ( $minPicker ) {
					if ( this.connectedMin.val() ) {
						var minDateVal = $minPicker.get('select');
						this.$datePicker.set('min', minDateVal.obj, {muted:true});
					}

					$minPicker.on( 'set', function() {
						var minDateVal = $minPicker.get('select');
						_this.$datePicker.set('min', minDateVal.obj, {muted:true});
					} );
				}
			}

			if ( this.settings.maxField ) {
				$maxPicker = this.getConnectedPicker(this.settings.maxField);
				if ( $maxPicker ) {
					if ( this.connectedMax.val() ) {
						var maxDateVal = $maxPicker.get('select');
						this.$datePicker.set('max', maxDateVal.obj, {muted:true});
					}

					$maxPicker.on( 'set', function() {
						var maxDateVal = $maxPicker.get('select');
						_this.$datePicker.set('max', maxDateVal.obj, {muted:true});
					} );
				}
			}
		},

		getConnectedField: function( id ) {
			$field = $('#'+id);
			if ( $field.length ) {
				return $field;
			}
			return false;
		},

		getConnectedPicker: function( id ) {
			$field = $('#'+id);
			if ( $field.length ) {
				$date = $field.parent().find('.datepicker');
				if ( $date.length ) {
					$picker = $date.pickadate('picker');
					return $picker;
				}
			}
			return false;
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
        	e.initMinMax();
        } );
    });

})( jQuery, window, document );