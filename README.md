# WordPress Mega Menu Block

![](https://img.shields.io/badge/license-GPL--2.0%2B-blue.svg?style=flat)

This plugin is a fork of [VD-Megamenu](https://github.com/vegetable-bits/vd-megamenu) which in it's own is a fork of [Getwid WordPress Mega Menu block](https://github.com/motopress/getwid-megamenu) with some adjustments and better style supports.
Built with Claude AI.

### List of improvements

* New sub-block for the dropdown.
* SCSS removed in favor of modern CSS for better compatibility with WordPress default styles.
* Better support for Wordpress default styles.
* Allow horizontal and vertical layouts for the mega menu and plain menu.
* Allow for default wp gap style support for spacing between menu items.
* Allow dropdowns to open on click or hover.
* Item padding controls for menu-items from menu main controls.
* Removed unnecessary controls for width (better to use Gutenberg built-in methods for this).
* Improved handling of nested menu items and dropdowns.
* Allow alignment of dropdown content to left, right, center or aligned with the parent menu-item.
* Allow positioning of dropdown content with a top offset control.
* Allow dropdown arrow to be turned on or off.


It allows you to build simple and advanced navigation menus the WordPress way with blocks.
With this [WordPress Mega Menu block](https://wordpress.org/plugins/mild-megamenu/), you'll be able to build and customize menus seamlessly using dedicated WP navigation blocks.

The WordPress Mega Menu block comprises several navigation blocks:

* Mega menu block
* Mega menu item block
* Plain menu block
* Plain menu item block

For advanced nav menus, use the mega menu item block. Its flexibility will let you add drop-down menus that can handle any WordPress block inside them, meaning you can show any content in your navigation menus.

A quick guide to working with the WordPress Mega Menu plugin:

* The mega menu block can host mega menu items with nested drop-downs, i.e. they can contain any Gutenberg blocks.
* ~~Plain menu blocks can contain plain menu items with drop-downs containing other plain menu items~~. Support for this has been revoked due to the fact such menus are bad UX and can be easily achieved with the mega menu block if really needed.
* You can change the width, color, font size, layouts (horizontal/vertical) of some mega menu blocks.
* Optionally turn on the "hamburger button" for your WordPress mega menu on mobile devices for easier navigation.
