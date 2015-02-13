Voce Post Meta Date
===================
Contributors: markparolisi, voceplatforms  
Tags: post, meta, date  
Requires at least: 3.5.0  
Tested up to: 4.1  
Stable tag: 3.0.0  
License: GPLv2 or later  
License URI: http://www.gnu.org/licenses/gpl-2.0.html

## Description
Extend Voce Post Meta with date/time pickers

## Installation

### As standard plugin:
> See [Installing Plugins](http://codex.wordpress.org/Managing_Plugins#Installing_Plugins).

### As theme or plugin dependency:
> After dropping the plugin into the containing theme or plugin, add the following:
```php
if( ! class_exists( 'Voce_Post_Meta_Date' ) ) {
	require_once( $path_to_voce_post_meta_date . '/voce-post-meta-date.php' );
}
```

## Usage

#### Basic Example

```php
<?php
add_action('init', function(){
	add_metadata_group( 'demo_meta', 'Page Options', array(
		'capability' => 'edit_posts'
	));
	add_metadata_field( 'demo_meta', 'demo_key', 'Start Date', 'date' );
	add_post_type_support( 'page', 'demo_meta' );
	
});
?>
```

#### Options

```max_date_field``` - ID of another 'date' field to use as a maximum for this field  
```min_date_field``` - ID of another 'date' field to use as a minimum for this field  
```max_date``` - Maximum date/time allowed for field (works in conjunction with ```max_date_field```)  
```min_date``` - Minimum date/time allowed for field (works in conjunction with ```min_date_field```)  
```default_text``` - Text to display if no date is set  
```default_date``` - Initial default date to set  
```year_range``` - Range of year dropdown, as specified here: [http://api.jqueryui.com/datepicker/#option-yearRange](http://api.jqueryui.com/datepicker/#option-yearRange)


#### Advanced Example

```php
<?php
add_action('init', function(){
	add_metadata_group( 'demo_meta', 'Page Options', array(
		'capability' => 'edit_posts'
	));
	add_metadata_field( 'demo_meta', 'demo_from', 'From', 'date', array(
		'max_date_field' => 'demo_meta_demo_to',
		'max_date' => '2013/08/25 2:00',
		'default_text' => 'Enter Value, Sir!',
	));
	add_metadata_field( 'demo_meta', 'demo_to', 'To', 'date', array(
		'min_date_field' => 'demo_meta_demo_from',
		'default_date' => '2013/08/28 5:00',
	));

	// Note: more than one field can use the same max_date_field/min_date_field
	add_metadata_field( 'demo_meta', 'demo_alt_to', 'Alternative To', 'date', array(
		'min_date_field' => 'demo_meta_demo_from',
	));

	add_post_type_support( 'page', 'demo_meta' );
});
?>
```

**2.1.0**
*Added 'year_range' argument.*

**2.0.4**
*Delete date meta value when one isn't set*

**2.0.2**
*Standardizing check for dependencies.*

**2.0.1**
*Added check for Voce_Meta_API.*

**1.2.2**  
*Fixing sanitization function.*

**1.2.1**  
*Fixing composer dependencies.*

**1.2**  
*Added sanitization function for return value.*

**1.1**  
*Added options for max/min date, max/min field, default text, and default value.*

**1.0**  
*Initial version.*
