// @TODO: time max/min isn't being enforced

/*global window,document,jQuery */
window.VocePostMetaDatePicker = {

	/**
	 * @constructor
	 * @return {undefined}
	 */
	construct: function() {
		jQuery(document).ready(function($) {
			$('.datepicker').each(function() {
				window.VocePostMetaDatePicker.init(this);
			}).each(function(){
				window.VocePostMetaDatePicker.updateLimits(this);
			});
			$(this).on('click', '.voce-date-clear', function(e) {
				e.preventDefault();
				window.VocePostMetaDatePicker.clear(this);
			});
		});
	},
	/**
	 * Parse the timepicker date into a unix timestamp
	 *
	 * @method timepickerToUnix
	 * @param string timepicker-formatted date
	 * @return int Unix timestamp
	 */
	timepickerToUnix: function(dateText) {
		var date = new Date(dateText);
		return parseInt(Math.round(date.getTime() / 1000), 10);
	},
    /**
     * Parse the timepicker date into a simple formatted date
     *
     * @method timepickerToFormatted
     * @param string timepicker-formatted date
     */
    timepickerToFormatted: function(dateText) {
        return this.unixToFormatted(this.timepickerToUnix(dateText));
    },
    /**
	 * Format unix date to simple formatted date
     *
     * @method unixToFormatted
     * @param string unix timestamp
     */
    unixToFormatted: function(unixDate) {
		var timestamp = parseInt(unixDate, 10),
			dateObject = new Date(timestamp * 1000),
			formatted = dateObject.getFullYear()+"/"+
				(this.padDate(dateObject.getMonth()+1))+"/"+
				(this.padDate(dateObject.getDate())+" "+
					this.padDate(dateObject.getHours())+":"+
					this.padDate(dateObject.getMinutes())
				);
		return formatted;
	},
    /**
     * Pad date with zeros for formatting purposes
     * 
     * @method padDate
     * @param integer date
     * @return string
     */
    padDate: function(date) {
        if (parseInt(date, 10) < 10) {
            date = "0"+date;
        }
        return date;
    },
	/**
	 * Initialize element
	 *
	 * @method init
	 * @param object el HTML element to use
	 */
	init: function(el) {
		this.bind(el);
		this.populateDate(el);
	},
	/**
	 * Bind datetimepicker to element
	 * 
	 * @method bind
	 * @param object el HTML element to trigger popup
	 */
	bind: function(el) {
		jQuery(el).datetimepicker({
			defaultTimezone: window.VocePostMetaDatePicker.timezone,
			dateFormat: 'yy/mm/dd',
			changeMonth: true,
			changeYear: true,
			onSelect: function(dateText, inst) {
				var inputID = jQuery(this).attr('id').replace('-formatted', ''),
					unixDate = window.VocePostMetaDatePicker.timepickerToUnix(dateText);
				jQuery("#"+inputID).val(unixDate);
			},
			onClose: function(dateText, inst) {
				var $el = jQuery(this),
					timepickerToUnix = window.VocePostMetaDatePicker.timepickerToUnix,
					elDateUnix = timepickerToUnix(dateText),
					elDate = window.VocePostMetaDatePicker.unixToFormatted(elDateUnix),
					minDate = $el.data('min_date'),
					minDateUnix = timepickerToUnix(minDate) || 0,
					maxDate = $el.data('max_date'),
					maxDateUnix = timepickerToUnix(maxDate) || 9999999999,
					inputID = $el.attr('id').replace('-formatted', ''),
					timepickerDate;

				// Bug Fix: if closed with no date selected, dateText takes on $el.val() (the default text) and sets the date to today's date
				// ------------------------------------------------------------
				if ($el.val() === $el.data('default_text')) {
					$el.datetimepicker('setDate', null).val($el.data('default_text'));
				}
				else
				// ------------------------------------------------------------
				if (elDateUnix < minDateUnix) {
					$el.datetimepicker('setDate', minDate).val(minDate);
				}
				else if (elDateUnix > maxDateUnix) {
					$el.datetimepicker('setDate', maxDate).val(maxDate);
				}

				window.VocePostMetaDatePicker.updateLimits(this);

				timepickerDate = $el.datetimepicker('getDate');

				jQuery('input[data-min_date_field='+inputID+']').each(function(){
					var $dependent = jQuery(this),
						testStartDate,
						testEndDate;

					if ($dependent.data('default_text') !== $dependent.val()) {
						testStartDate = timepickerToUnix(timepickerDate);
						testEndDate = timepickerToUnix($dependent.datetimepicker('getDate'));
						if (testStartDate > testEndDate) {
							$dependent.datetimepicker('setDate', timepickerDate);
						}
					}
				});

				jQuery('input[data-max_date_field='+inputID+']').each(function(){
					var $dependent = jQuery(this),
						testStartDate,
						testEndDate;

					if ($dependent.data('default_text') !== $dependent.val()) {
						testStartDate = timepickerToUnix($dependent.datetimepicker('getDate'));
						testEndDate = timepickerToUnix(timepickerDate);
						if (testStartDate > testEndDate) {
							$dependent.datetimepicker('setDate', timepickerDate);
						}
					}
				});
			}
		});
	},
	/**
	 * Set the initial date in the textbox and in timepicker
	 * 
	 * @method populateDate
	 * @param object el
	 */
	populateDate: function(el) {
		var $el = jQuery(el),
			defaultDate = $el.data('default_date'),
			inputID = $el.attr('id').replace('-formatted', ''),
			savedDate = parseInt(jQuery('#'+inputID).val(), 10),
			formatted;

        if (savedDate) {
            formatted = this.unixToFormatted(savedDate);
			console.log(formatted);
            $el.datetimepicker('setDate', formatted).val(formatted);
        }
		else if (defaultDate) {
            $el.datetimepicker('setDate', defaultDate).val(defaultDate);
		}
		else {
			$el.datetimepicker('setDate', null).val($el.data('default_text'));
		}
	},
    /**
     * Update any dependent limits
     *
     * @method updateLimits
     * @param object el HTML element that is used as a limiter
     */
    updateLimits: function(el) {
		var $el = jQuery(el),
			elDate = $el.datetimepicker('getDate'),
			elDateUnix = this.timepickerToUnix(elDate),
			minDate = $el.data('min_date'),
			minDateUnix = this.timepickerToUnix(minDate),
			maxDate = $el.data('max_date'),
			maxDateUnix = this.timepickerToUnix(maxDate),
			inputID = $el.attr('id').replace('-formatted', '');

		if (minDateUnix) {
			this.setLimit(el, 'min', minDate);
		}
		if (maxDateUnix) {
			this.setLimit(el, 'max', maxDate);
		}

		jQuery('input[data-min_date_field='+inputID+']').each(function(){
			var $this = jQuery(this),
				minDate = $this.data('min_date'),
				minDateUnix = window.VocePostMetaDatePicker.timepickerToUnix(minDate) || 9999999999,
				newLimit = minDateUnix < elDateUnix ? elDate : minDate;
			window.VocePostMetaDatePicker.setLimit(this, 'min', newLimit);
		});

		jQuery('input[data-max_date_field='+inputID+']').each(function(){
			var $this = jQuery(this),
				maxDate = $this.data('max_date'),
				maxDateUnix = window.VocePostMetaDatePicker.timepickerToUnix(maxDate) || 0,
				newLimit = maxDateUnix > elDateUnix ? elDate : maxDate;
			window.VocePostMetaDatePicker.setLimit(this, 'max', newLimit);
		});
    },
    /**
	 * Set a limit on a field
     *
     * @method setDateLimit
     * @param object el HTML element on which to set limit
	 * @param string type min|max
	 * @param string limit The new limit in timepicker format
     */
    setLimit: function(el, type, limit) {
		var $el = jQuery(el);
			current = $el.datetimepicker('getDate'),
			newValue = current ? this.timepickerToFormatted(current) : $el.data('default_text');

		jQuery(el).datetimepicker('option', type+'Date', limit);
		$el.datetimepicker('setDate', current).val(newValue);

		// Bug Fix: if a timepicker with a null value is set to null, the timepicker resets itself to today's date
		// ------------------------------------------------------------
			if (!current) {
				$el.datetimepicker('setDate', this.unixToFormatted(0));
				$el.datetimepicker('setDate', null).val($el.data('default_text'));
			}
		// ------------------------------------------------------------
	},
	/**
	 * Clear value and remove field limits
	 * 
	 * @method clear
	 * @param object el
	 */
	clear: function(el) {
		var $el = jQuery(el).parent().find('.datepicker'),
			inputID = $el.attr('id').replace('-formatted', ''),
			$value = jQuery('#'+inputID);

		if ($el.datetimepicker('getDate')) {
			$el.datetimepicker('setDate', null).val($el.data('default_text'));
			$value.val('');

			this.updateLimits($el);
		}
	}
};
window.VocePostMetaDatePicker.construct();
