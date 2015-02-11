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
					_this.onClose();
				}
			};

			this.$datePicker.on(callbacks);
			this.$timePicker.on(callbacks);
		},

		onClose: function() {
			var dateVal = this.$datePicker.get('select');
			var timeVal = this.$timePicker.get('select');
		},

		updateHidden: function() {

		}

	};

    $(document).ready(function(){
        $('.vpm-datetime').each(function(i, e){
            new vpmDateTime( this, $(this).data('field-settings') );
        });
    });

})( jQuery, window, document );