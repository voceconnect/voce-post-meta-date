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
            padDate = window.VocePostMetaDatePicker.padDate,
			hours = dateObject.getHours(),
			ampm = ( hours > 11 ) ? 'PM' : 'AM',
			hours = ( hours > 12 ) ? hours - 12 : hours,
            hours = ( 0 === hours ) ? 12 : hours,
            formatted = dateObject.getFullYear()+"/"+
                (padDate(dateObject.getMonth()+1))+"/"+
                (padDate(dateObject.getDate())+" "+
                    padDate(hours)+":"+
                    padDate(dateObject.getMinutes())+" "+
					ampm
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
        var $this = this;
        jQuery(el).datetimepicker({
            defaultTimezone: $this.timezone,
            dateFormat: 'yy/mm/dd',
			timeFormat: 'hh:mm TT',
            changeMonth: true,
            changeYear: true,
            onSelect: function(dateText, inst) {
                var inputID = jQuery(this).attr('id').replace('-formatted', ''),
                    unixDate = $this.timepickerToUnix(dateText);
                jQuery('#'+inputID).val(unixDate);
            },
            onClose: function(dateText, inst) {
                var $el = jQuery(this),
                    timepickerToUnix = $this.timepickerToUnix,
                    elLimits = $this.getMinMax($el),
                    newMin = elLimits.elMin,
                    newMinUnix = timepickerToUnix(newMin),
                    newMax = elLimits.elMax,
                    newMaxUnix = timepickerToUnix(newMax),
                    elDateUnix = timepickerToUnix(dateText),
                    inputID = $el.attr('id').replace('-formatted', '');

                // if closed with no date selected, dateText takes on $el.val() (the default text) and sets the date to today's date
                // ------------------------------------------------------------
                if ($el.val() === $el.data('default_text')) {
                    $el.datetimepicker('setDate', null).val($el.data('default_text'));
                    jQuery('#'+inputID).val('');
                }
                else
                // ------------------------------------------------------------
                if (elDateUnix < newMinUnix) {
                    $el.datetimepicker('setDate', newMin).val(newMin);
                    jQuery('#'+inputID).val(newMinUnix);
                }
                else if (elDateUnix > newMaxUnix) {
                    $el.datetimepicker('setDate', newMax).val(newMax);
                    jQuery('#'+inputID).val(newMaxUnix);
                }

                $this.updateLimits(this);
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
            defaultDate = $el.data('default_date') ? this.timepickerToFormatted($el.data('default_date')) : null,
            inputID = $el.attr('id').replace('-formatted', ''),
            savedDate = parseInt(jQuery('#'+inputID).val(), 10),
            formatted;

        if (savedDate) {
            formatted = this.unixToFormatted(savedDate);
            $el.datetimepicker('setDate', formatted).val(formatted);
        }
        else if (defaultDate) {
            $el.datetimepicker('setDate', defaultDate).val(defaultDate);
            jQuery("#"+inputID).val(this.timepickerToUnix(defaultDate));
        }
        else {
            $el.datetimepicker('setDate', null).val($el.data('default_text'));
        }
    },
    /**
     * Get min and max for an element
     *
     * @method getMinMax
     * @param object jQuery element for which to get min/max
     */
    getMinMax: function($el) {
        var minDate = $el.data('min_date'),
            minDateUnix = this.timepickerToUnix(minDate) || -9999999999,
            minDateField = $el.data('min_date_field'),
            minDateFieldVal = minDateField ? jQuery('#'+minDateField+'-formatted').datetimepicker('getDate') : null,
            minDateFieldUnix = this.timepickerToUnix(minDateFieldVal) || -9999999999,
            elMin = minDateUnix > minDateFieldUnix ? this.unixToFormatted(minDateUnix) : this.unixToFormatted(minDateFieldUnix),
            maxDate = $el.data('max_date'),
            maxDateUnix = this.timepickerToUnix(maxDate) || 9999999999,
            maxDateField = $el.data('max_date_field'),
            maxDateFieldVal = maxDateField ? jQuery('#'+maxDateField+'-formatted').datetimepicker('getDate') : null,
            maxDateFieldUnix = this.timepickerToUnix(maxDateFieldVal) || 9999999999,
            elMax = maxDateUnix < maxDateFieldUnix ? this.unixToFormatted(maxDateUnix) : this.unixToFormatted(maxDateFieldUnix);

        return {'elMin': elMin, 'elMax': elMax};
    },
    /**
     * Update any dependent limits
     *
     * @method updateLimits
     * @param object el HTML element that is used as a limiter
     */
    updateLimits: function(el) {
        var $el = jQuery(el),
            elLimits = this.getMinMax($el),
            timepickerToUnix = this.timepickerToUnix,
            unixToFormatted = this.unixToFormatted,
            elDate = $el.datetimepicker('getDate'),
            elDateUnix = timepickerToUnix(elDate),
            inputID = $el.attr('id').replace('-formatted', ''),
            value = jQuery('#'+inputID).val();

        this.setLimit(el, 'min', elLimits.elMin);
        this.setLimit(el, 'max', elLimits.elMax);

        // update fields that use this field as a limiter
        jQuery('input[data-min_date_field='+inputID+']').each(function(){
            var $dependent = jQuery(this),
                minDate = $dependent.data('min_date'),
                minDateUnix = timepickerToUnix(minDate) || -9999999999,
                newLimit = ('' === value || minDateUnix > elDateUnix) ? unixToFormatted(minDateUnix) : elDate,
                depInputID = $dependent.attr('id').replace('-formatted', ''),
                depStartDateUnix;

            window.VocePostMetaDatePicker.setLimit(this, 'min', newLimit);

            if ($dependent.data('default_text') !== $dependent.val()) {
                depStartDateUnix = timepickerToUnix($dependent.datetimepicker('getDate'));
                if ('' !== value && elDateUnix > depStartDateUnix) {
                    $dependent.datetimepicker('setDate', elDate);
                    jQuery('#'+depInputID).val(elDateUnix);
                }
            }
        });

        jQuery('input[data-max_date_field='+inputID+']').each(function(){
            var $dependent = jQuery(this),
                maxDate = $dependent.data('max_date'),
                maxDateUnix = timepickerToUnix(maxDate) || 9999999999,
                newLimit = ('' === value || maxDateUnix < elDateUnix) ? unixToFormatted(maxDateUnix) : elDate,
                depInputID = $dependent.attr('id').replace('-formatted', ''),
                depEndDateUnix;

            window.VocePostMetaDatePicker.setLimit(this, 'max', newLimit);

            if ($dependent.data('default_text') !== $dependent.val()) {
                depEndDateUnix = timepickerToUnix($dependent.datetimepicker('getDate'));
                if ('' !== value && elDateUnix < depEndDateUnix) {
                    $dependent.datetimepicker('setDate', elDate);
                    jQuery('#'+depInputID).val(elDateUnix);
                }
            }
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
        var $el = jQuery(el),
            current = $el.datetimepicker('getDate'),
            newValue = current ? this.timepickerToFormatted(current) : $el.data('default_text'),
            inputID = $el.attr('id').replace('-formatted', '');

        $el.datetimepicker('option', type+'Date', limit);
        $el.datetimepicker('setDate', current).val(newValue);
        jQuery('#'+inputID).val(this.timepickerToUnix(current));

        // Bug Fix: if a timepicker with a null value is set to null, the timepicker resets itself to today's date
        // ------------------------------------------------------------
            if (!current) {
                $el.datetimepicker('setDate', this.unixToFormatted(0));
                $el.datetimepicker('setDate', null).val($el.data('default_text'));
                jQuery('#'+inputID).val('');
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
