<?php
/*
  Plugin Name: Voce Meta Date
  Plugin URI: http://vocecommunications.com
  Description: Extends Voce Post Meta with a date picker field
  Version: 1.0
  Author: markparolisi, voceplatforms
  Author URI: http://vocecommunications.com
  License: GPLv2
 */

class Voce_Post_Meta_Date {

	/**
	 * Setup plugin
	 */
	public static function initialize() {
		add_filter( 'meta_type_mapping', array(__CLASS__, 'meta_type_mapping') );
		add_action( 'admin_enqueue_scripts', array(__CLASS__, 'action_admin_enqueue_scripts') );
		add_action( 'admin_print_footer_scripts', array(__CLASS__, 'print_timezone') );
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
		wp_enqueue_style( 'jquery-datepicker-style', self::plugins_url( 'jquery-ui.css', __FILE__ ) );
		wp_enqueue_script( 'jquery-timepicker', self::plugins_url( 'timepicker.js', __FILE__ ), array('jquery', 'jquery-ui-core', 'jquery-ui-datepicker', 'jquery-ui-slider') );
		wp_enqueue_script( 'voce-post-meta-date', self::plugins_url( 'voce-post-meta-date.js', __FILE__ ), array('jquery', 'jquery-ui-core') );
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
			return $url;
		} else {
			return plugins_url( $relative_path, $plugin_path );
		}
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
				'display_callbacks' => array('voce_date_field_display')
			)
		);
		return $mapping;
	}

}

Voce_Post_Meta_Date::initialize();

/**
 * Public callback function to display HTML meta form field
 * @param object $field
 * @param string $value
 * @param int $post_id
 */
function voce_date_field_display( $field, $value, $post_id ) {
	?>
	<p>
		<?php voce_field_label_display( $field ); ?>
		<input type="text" class="datepicker" id="<?php echo $field->id; ?>-formatted" value="Select Date" readonly />
		<input class="hidden" type="hidden" id="<?php echo $field->id; ?>" name="<?php echo $field->id; ?>" value="<?php echo esc_attr( $value ); ?>"  />
		<a href="#" class="submitdelete deletion voce-date-clear">Clear</a>
	</p>
	<?php
}