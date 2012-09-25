<?php
/*
  Plugin Name: Voce Meta Date
  Plugin URI: http://vocecommunications.com
  Description: Extends Voce Post Meta with a date picker field
  Version: 0.1
  Author: Mark Parolisi
  Author URI: http://vocecommunications.com
  License: A "Slug" license name e.g. GPL2
 */

class Voce_Post_Meta_Date {

	public static function initialize() {
		add_filter( 'meta_type_mapping', array( __CLASS__, 'meta_type_mapping' ) );
		add_action( 'admin_enqueue_scripts', array( __CLASS__, 'action_admin_enqueue_scripts' ) );
		add_filter( 'attachment_fields_to_edit', array( __CLASS__, 'add_attachment_field' ), 20, 2 );
	}

	/** Enqueue admin JavaScripts
	 *
	 * @return void
	 */
	public static function action_admin_enqueue_scripts( $hook ) {
		// only load on select pages
		if ( !in_array( $hook, array( 'post-new.php', 'post.php', 'media-upload-popup' ) ) ) {
			return;
		}
		wp_enqueue_style( 'jquery-datepicker-style', self::plugins_url( 'jquery-ui.css', __FILE__ ) );
		wp_enqueue_script( "voce-post-meta-date", self::plugins_url( 'voce-post-meta-date.js', __FILE__ ), array( 'jquery', 'jquery-ui-datepicker' ) );
	}

	/**
	 * @method plugins_url
	 * @param type $relative_path
	 * @param type $plugin_path
	 * @return string 
	 */
	public static function plugins_url( $relative_path, $plugin_path ) {
		$template_dir = get_template_directory();

		foreach (array( 'template_dir', 'plugin_path' ) as $var) {
			$$var = str_replace( '\\', '/', $$var ); // sanitize for Win32 installs
			$$var = preg_replace( '|/+|', '/', $$var );
		}
		if ( 0 === strpos( $plugin_path, $template_dir ) ) {
			$url = get_template_directory_uri();
			$folder = str_replace( $template_dir, '', dirname( $plugin_path ) );
			if ( '.' != $folder ) {
				$url .= '/' . ltrim( $folder, '/' );
			}
			if ( !empty( $relative_path ) && is_string( $relative_path ) && strpos( $relative_path, '..' ) === false ) {
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
				'display_callbacks' => array( 'voce_date_field_display' )
			)
		);
		return $mapping;
	}

}

if ( class_exists( 'Voce_Meta_API' ) ) {
	Voce_Post_Meta_Date::initialize();

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

}