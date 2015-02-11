<?php
/*
  Plugin Name: Voce Meta Date
  Plugin URI: http://vocecommunications.com
  Description: Extends Voce Post Meta with a date picker field
  Version: 3.0.0
  Author: markparolisi, banderon, voceplatforms
  Author URI: http://vocecommunications.com
  License: GPLv2
 */

if ( ! class_exists( 'Voce_Post_Meta_Date' ) ) :

class Voce_Post_Meta_Date {

	/**
	 * Setup plugin
	 */
	public static function initialize() {
		add_filter( 'meta_type_mapping', array(__CLASS__, 'meta_type_mapping') );
		add_action( 'admin_enqueue_scripts', array(__CLASS__, 'action_admin_enqueue_scripts') );
		add_action( 'admin_print_footer_scripts', array(__CLASS__, 'print_timezone') );
		add_action( 'admin_init', array( __CLASS__, 'admin_init' ) );
	}

	/**
	 * Add action for admin_notices
	 * @method admin_init
	 * @return void
	 */
	static function admin_init(){
		add_action( 'admin_notices', array( __CLASS__, 'check_dependencies' ) );
	}

	/**
	 * Display admin notice message
	 * @method add_admin_notice
	 * @param string $notice
	 * @return void
	 */
	static function add_admin_notice( $notice ){
		echo '<div class="error"><p>' . $notice . '</p></div>';
	}

	/**
	 * Checks plugin dependencies
	 * @method check_dependencies
	 * @return void
	 */
	static function check_dependencies(){
		$dependencies = array(
			'Voce Post Meta' => array(
				'url' => 'https://github.com/voceconnect/voce-post-meta',
				'class' => 'Voce_Meta_API'
			)
		);

		foreach( $dependencies as $plugin => $plugin_data ){
			if ( !class_exists( $plugin_data['class'] ) ){
				$notice = sprintf( 'The Voce Post Meta Post Date Plugin cannot be utilized without the <a href="%s" target="_blank">%s</a> plugin.', esc_url( $plugin_data['url'] ), $plugin );
				self::add_admin_notice( __( $notice, 'voce-post-meta-date' ) );
			}
		}
	}

	/**
	 * Enqueue admin JavaScripts
	 * @return void
	 */
	public static function action_admin_enqueue_scripts( $hook ) {
		$pages = apply_filters( 'voce_post_meta_date_scripts', array('post-new.php', 'post.php',) );
		if( !in_array( $hook, $pages ) ) {
			return;
		}
		// Pickadate Styles
		wp_enqueue_style( 'pickadate-picker', self::plugins_url( 'pickadate/themes/classic.css', __FILE__ ) );
		wp_enqueue_style( 'pickadate-picker-date', self::plugins_url( 'pickadate/themes/classic.date.css', __FILE__ ) );
		wp_enqueue_style( 'pickadate-picker-time', self::plugins_url( 'pickadate/themes/classic.time.css', __FILE__ ) );

		// Pickadate Scripts
		wp_enqueue_script( 'pickadate-picker', self::plugins_url( 'pickadate/picker.js', __FILE__ ), array('jquery') );
		wp_enqueue_script( 'pickadate-picker-date', self::plugins_url( 'pickadate/picker.date.js', __FILE__ ), array('jquery', 'pickadate-picker') );
		wp_enqueue_script( 'pickadate-picker-time', self::plugins_url( 'pickadate/picker.time.js', __FILE__ ), array('jquery', 'pickadate-picker') );
		wp_enqueue_script( 'pickadate-legacy', self::plugins_url( 'pickadate/legacy.js', __FILE__ ), array('jquery', 'pickadate-picker') );

		// Custom initialize script
		wp_enqueue_script( 'voce-post-meta-date', self::plugins_url( 'voce-post-meta-date.js', __FILE__ ), array('jquery', 'pickadate-picker-date', 'pickadate-picker-time', 'pickadate-legacy') );
	}

	public static function print_timezone() {
		$timezone = get_option( 'gmt_offset' );
		echo "
		<script>
			if(window.VocePostMetaDatePicker){window.VocePostMetaDatePicker.timezone = " . esc_js( $timezone ) . ";}
		</script>";
	}

	/**
	 * Allow this plugin to live either in the plugins directory or inside
	 * the themes directory.
	 *
	 * @method plugins_url
	 * @param type $relative_path
	 * @param type $plugin_path
	 * @return string
	 */
	public static function plugins_url( $relative_path, $plugin_path ) {
		$template_dir = get_template_directory();

		foreach( array('template_dir', 'plugin_path') as $var ) {
			$$var = str_replace( '\\', '/', $$var ); // sanitize for Win32 installs
			$$var = preg_replace( '|/+|', '/', $$var );
		}
		if( 0 === strpos( $plugin_path, $template_dir ) ) {
			$url = get_template_directory_uri();
			$folder = str_replace( $template_dir, '', dirname( $plugin_path ) );
			if( '.' != $folder ) {
				$url .= '/' . ltrim( $folder, '/' );
			}
			if( !empty( $relative_path ) && is_string( $relative_path ) && strpos( $relative_path, '..' ) === false ) {
				$url .= '/' . ltrim( $relative_path, '/' );
			}
		} else {
			$url = plugins_url( $relative_path, $plugin_path );
		}

		return apply_filters( 'voce-post-meta-date_plugins_url', $url, $relative_path, $plugin_path );
	}

	/**
	 * @method meta_type_mapping
	 * @param type $mapping
	 * @return array
	 */
	public static function meta_type_mapping( $mapping ) {
		$mapping['date'] = array(
			'class' => 'Voce_Meta_Field',
			'args' => array(
				'display_callbacks' => array('voce_date_field_display'),
				'sanitize_callbacks' => array('voce_date_field_sanitize')
			)
		);
		return $mapping;
	}
}

Voce_Post_Meta_Date::initialize();

function voce_date_field_display( $field, $value, $post_id ) {
	if ( $value ) {
		$date_val = date('j F, Y', $value);
		$time_val = date('g:i A', $value);
	} else {
		$date_val = 'Select Date';
		$time_val = 'Select Time';
	}
	?>
	<div>
		<strong><?php voce_field_label_display( $field ); ?></strong>
		<p><label>Date: </label><input type="text" class="datepicker" value="<?php echo esc_attr($date_val); ?>" /></p>
		<p><label>Time: </label><input type="text" class="timepicker" value="<?php echo esc_attr($time_val); ?>" /></p>
		<input type="hidden" class="vpm-datetime" id="<?php echo $field->get_input_id(); ?>" name="<?php echo $field->get_name(); ?>" value="<?php echo esc_attr($value); ?>" />
	</div>
	<?php
}

/**
 * Public callback function to display HTML meta form field
 * @param object $field
 * @param string $value
 * @param int $post_id
 */
function voce_date_field_display_old( $field, $value, $post_id ) {
	$defaults = array(
		'max_date'       => '',
		'min_date'       => '',
		'max_date_field' => '',
		'min_date_field' => '',
		'default_text'   => 'Select Date',
		'default_date'   => '',
		'year_range'     => '',
	);
	$args = wp_parse_args( $field->args, $defaults );

	$input_pattern = '<input type="text" class="datepicker" id="%s-formatted" data-default_text="%s" data-default_date="%s" data-max_date="%s" data-min_date="%s" data-max_date_field="%s" data-min_date_field="%s" data-year_range="%s" readonly />';
	?>
	<p>
		<?php voce_field_label_display( $field ); ?>
		<?php printf( $input_pattern, $field->get_input_id(), esc_attr( $args['default_text'] ), esc_attr( $args['default_date'] ), esc_attr( $args['max_date'] ), esc_attr( $args['min_date'] ), esc_attr( $args['max_date_field'] ), esc_attr( $args['min_date_field'] ), esc_attr( $args['year_range'] ) ); ?>
		<input class="hidden" type="hidden" id="<?php echo $field->get_input_id(); ?>" name="<?php echo $field->get_name(); ?>" value="<?php echo esc_attr( $value ); ?>"  />
		<a href="#" class="submitdelete deletion voce-date-clear">Clear</a>
		<?php echo !empty( $field->description ) ? ('<br><span class="description">' . wp_kses( $field->description, Voce_Meta_API::GetInstance()->description_allowed_html ) . '</span>') : ''; ?>
	</p>
	<?php
}

function voce_date_field_sanitize( $field, $old, $new, $post_id ) {
	if(is_numeric($new)) {
		return intval($new);
	} else {
		return null;
	}
}

endif;