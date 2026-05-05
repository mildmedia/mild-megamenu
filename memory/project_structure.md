---
name: Project Structure
description: DOM structure, class names, PHP render callbacks, JS functions, and CSS rules for mild-megamenu plugin
type: project
---

## Plugin: mild-megamenu

WordPress Gutenberg block plugin. Build: `npm run build`.

## Block hierarchy

```
mild-megamenu/menu          → MegaMenu.php
  mild-megamenu/menu-item   → MegaMenuItem.php
    mild-megamenu/menu-item-dropdown → MegaMenuItemDropdown.php (new, untracked)
mild-megamenu/plain-menu
  mild-megamenu/plain-menu-item
```

## Rendered DOM (frontend)

```html
<div class="megamenu [has-full-width-dropdown] [is-collapsible] [justify-items-*]" id="megamenu-X">
  <nav class="megamenu-wrapper">
    <div class="megamenu-toggle-wrapper is-hidden">...</div>
    <div class="megamenu-content-wrapper">
      <ul class="megamenu-content">
        <li class="menu-item [has-children] [has-click-trigger] [is-current]">
          <div class="menu-item-link">
            <a href="...">Link text</a>
            <button class="menu-item-toggle">...</button>
          </div>
          <!-- Only if has children: -->
          <div class="dropdown-wrapper align-[left|center|right|item]">
            <div class="dropdown">
              <div class="dropdown-content">
                <!-- InnerBlocks (mild-megamenu/menu-item-dropdown content) -->
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </nav>
</div>
```

## Key CSS rules (src/style.css)

- `.megamenu` → `position: relative`
- `.megamenu.has-full-width-dropdown` → `position: static` (so dropdown escapes to parent containing block)
- `.megamenu.has-full-width-dropdown .menu-item` → `position: static`
- `.dropdown-wrapper` → `position: absolute; left: 0; right: 0; top: 100%; height: 0; overflow: hidden; z-index: 100`
- `.megamenu:not(.is-mobile) .menu-item:hover .dropdown-wrapper` → `height: auto; overflow: visible`

## Frontend JS (src/frontend.js)

**Functions:**
- `setDropdownAlignment(menus)` — Only for `has-full-width-dropdown`. For `.dropdown-wrapper.align-item`, sets `content.style.marginLeft` to align dropdown-content with menu-item. Does NOT set wrapper left/width.
- `showMenuToggleButton(menus)` — Shows/hides toggle button based on breakpoint, adds/removes `is-mobile`
- `attachToggleActionToButtons(menus)` — Click handler for `.has-click-trigger` menu items and toggle buttons
- `toggleMobileMenu(toggle_button, menu)` — Toggles `is-opened` class
- `setMobileMenuPosition(menus)` — Sets negative left + explicit width on `.megamenu-content-wrapper` for mobile. **Currently defined but NOT called.**

**Called on load:** `showMenuToggleButton`, `attachToggleActionToButtons`, `setDropdownAlignment`
**Called on resize:** `showMenuToggleButton`, `setDropdownAlignment`

## Known issue / in progress

The old `setDropdownsPosition` function (which set `left: -menuCoords.left` + `width: window.innerWidth` on the dropdown wrapper for `has-full-width-dropdown`) was replaced with `setDropdownAlignment` (which only sets `marginLeft` on content). This lost the explicit wrapper sizing.

**Plan:** Restore wrapper positioning logic — set negative `left` on `.dropdown-wrapper` and `width: window.innerWidth` for `has-full-width-dropdown`. For Gutenberg editor: use ResizeObserver in `edit.js` to measure editor canvas width and apply it to the dropdown wrapper.

CSS change also needed: `.dropdown-wrapper` `right: 0` → `width: 100%` to avoid conflict when JS overrides `left`.

## Source files

- `src/frontend.js` — frontend JS
- `src/style.css` — all frontend CSS (untracked, new)
- `src/index.css` — editor CSS
- `src/menu/edit.js`, `src/menu/save.js`, `src/menu/controls.js`
- `src/menu-item/edit.js`, `src/menu-item/save.js`, `src/menu-item/controls.js`
- `src/menu-item-dropdown/edit.js`, `src/menu-item-dropdown/save.js` (new, untracked)
- `includes/blocks/MegaMenu.php`, `MegaMenuItem.php`, `MegaMenuItemDropdown.php`
