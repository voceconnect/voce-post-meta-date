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
			this.listen();
		},

		listen: function() {
			var callbacks = {
				close: this.onClose
			};

			this.$dateField.pickadate('picker').on(callbacks);
			this.$timeField.pickatime('picker').on(callbacks);
		},

		onClose: function() {
			console.log(this);
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