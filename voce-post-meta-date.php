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
				'display_callbacks' => array( array( __CLASS__, 'display_field' ) ),
				'sanitize_callbacks' => array( array( __CLASS__, 'sanitize_field' ) )
			)
		);
		return $mapping;
	}

	private static function get_field_settings( $args ) {
		$field_settings = array(
			'dateField' => array(),
			'timeField' => array(),
		);

		if ( !empty($args['min_date']) )
			$field_settings['dateField']['min'] = $args['min_date'] * 1000;

		if ( !empty($args['max_date']) )
			$field_settings['dateField']['max'] = $args['max_date'] * 1000;

		if ( !empty($args['min_date_field']) )
			$field_settings['minField'] = $args['min_date_field'];

		if ( !empty($args['max_date_field']) )
			$field_settings['maxField'] = $args['max_date_field'];

		return $field_settings;
	}

	public static function display_field( $field, $value, $post_id ) {
		$defaults = array(
			'min_date' => false,
			'max_date' => false,
			'min_date_field' => false,
			'max_date_field' => false
		);
		$args = wp_parse_args( $field->args, $defaults );
		$field_settings = self::get_field_settings( $args );

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
			<input type="hidden" class="vpm-datetime" data-field-settings="<?php echo esc_attr(json_encode($field_settings)); ?>" id="<?php echo $field->get_input_id(); ?>" name="<?php echo $field->get_name(); ?>" value="<?php echo esc_attr($value); ?>" />
		</div>
		<?php
	}

	public static function sanitize_field( $field, $old, $new, $post_id ) {
		if(is_numeric($new)) {
			return intval($new);
		} else {
			return null;
		}
	}

}

Voce_Post_Meta_Date::initialize();

endif;