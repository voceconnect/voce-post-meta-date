window.VocePostMetaDatePicker = {
        
            /**
     *
     * @method construct
     * @constructor
     */
    construct : function(){
        jQuery(document).ready(function($){
            $('.datepicker').each(function(){
                VocePostMetaDatePicker.init(this);
            });
        });
        
    },
        
        /**
         *
         * @method init
         * @param object el HTML element to use
         */
        init: function(el){
            this.bind(el);
            this.populateDisplayDate(el);
        },
        
        /**
         * Parse the date into a timestamp
         *
         * @method unixDate
         * @param object inst Instance from DatePicker plugin
         */
        unixDate: function(inst){
            var date = new Date( inst.selectedYear, inst.selectedMonth, inst.selectedDay );
            return Math.round( date.getTime()/1000 );
        },
        
        /**
         * 
         * @method bind
         * @param object el HTML element to trigger popup
         */
        bind: function(el){
            jQuery(el).datepicker({
                dateFormat: 'yy/mm/dd',
                changeMonth: true,
                changeYear: true,
                onSelect: function(dateText, inst) {
                    var inputID = jQuery(this).attr('id').replace("-formatted", "");
                    var formatted = VocePostMeta.DatePicker.unixDate(inst);
                    jQuery("#"+inputID).val(formatted);
                }
            });
        },
        
        /**
         * Just prepend a zero to date for formatting purposes
         * 
         * @method padDate
         * @param integer date
         */
        padDate : function(date){
            if(parseInt(date) < 10){
                date = "0" + date;
            }
            return date;
        },
        
        /**
         * 
         * @method populateDisplayDate
         * @param object el
         */
        populateDisplayDate: function(el){
            var inputID = jQuery(el).attr('id').replace("-formatted", "");
            var timestamp = parseInt(jQuery('#'+inputID).val());
            var dateObject = new Date(timestamp * 1000)
            var formatted = dateObject.getFullYear() + "/" + (this.padDate(dateObject.getMonth() + 1)) + "/" + (this.padDate(dateObject.getDate()));
            jQuery(el).val(formatted);
        }
    }
        
    
}

VocePostMetaDatePicker.construct();
