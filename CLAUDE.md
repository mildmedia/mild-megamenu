# mild-megamenu

WordPress Gutenberg block plugin. Build: `npm run build`.

## Future improvements

### Vertical menu — submenu positioning
Dropdown in a vertical menu (`is-orientation-vertical`) is currently broken/awkward — the dropdown overlaps the menu items instead of appearing beside them.

Future work:
- Rename "dropdown" to "submenu" conceptually when used inside a vertical menu
- Allow submenu to be placed to the left or right of the parent menu (not below it)
- Likely needs a separate CSS positioning mode + JS adjustment for vertical menus
