=== Voce Post Meta Date ===
Contributors: markparolisi, voceplatforms
Donate link: 
Tags: 
Requires at least: 3.5.0
Tested up to: 3.6
Stable tag: 1.0
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Extend Voce Post Meta with date/time pickers

== Description ==

Extend Voce Post Meta with date/time pickers

== Installation ==

1. Upload `voce-post-meta-date` to the `/wp-content/plugins/` directory
1. Activate the plugin through the 'Plugins' menu in WordPress
1. Create post meta fields like this
```
add_action('init', function(){
  add_metadata_group( 'demo_meta', 'Page Options', array(
      'capability' => 'edit_posts'
  ) );
  add_metadata_field( 'demo_meta', 'demo_date', 'Demo Date', 'date' );
  add_post_type_support( 'page', 'demo_meta' );
});
```

== Changelog ==

= 1.0 =
* Initial release