document.addEventListener('DOMContentLoaded', function () {
    const menus = document.querySelectorAll('.megamenu');
    const plainMenus = document.querySelectorAll('.megamenu');
    const menuToggles = document.querySelectorAll('.megamenu-toggle');

    function setDropdownAlignment(menus) {
        menus.forEach(menu => {

            if (menu.classList.contains('is-mobile') || !menu.classList.contains('has-full-width-dropdown')) {
                return;
            }

            menu.querySelectorAll('.dropdown-wrapper.align-item').forEach(wrapper => {
                const menuItem = wrapper.closest('.menu-item');
                const content = wrapper.querySelector('.dropdown-content');
                if (!menuItem || !content) return;
                const itemRect = menuItem.getBoundingClientRect();
                const wrapperRect = wrapper.getBoundingClientRect();
                content.style.marginLeft = (itemRect.left - wrapperRect.left) + 'px';
            });
        });
    }

    function showMenuToggleButton(menus) {
        menus.forEach(menu => {
            if (!menu.classList.contains('is-collapsible')) {
                return;
            }
            const breakpoint = parseInt(menu.dataset.responsiveBreakpoint);
            const toggleButtonWrapper = menu.querySelector('.megamenu-toggle-wrapper');
            const windowWidth = window.innerWidth;

            if (breakpoint >= windowWidth) {
                toggleButtonWrapper.classList.remove('is-hidden');
                menu.classList.add('is-mobile');
            } else {
                toggleButtonWrapper.classList.add('is-hidden');
                menu.classList.remove('is-mobile', 'is-opened');
            }
        });
    }

    function attachToggleActionToButtons(menus) {

        document.addEventListener('click', function (event) {

            const target = event.target;
            if (target.closest('.menu-item.has-click-trigger')) {
                if (target.closest('.dropdown-wrapper')) {
                    return;
                }
                event.preventDefault();
                const menuItem = target.closest('.menu-item');
                const megaMenu = menuItem.closest('.megamenu');
                const openMenus = document.querySelectorAll('.menu-item.has-click-trigger.is-opened');
                console.log('closing other dropdowns');
                openMenus.forEach(item => {
                    // close all but this menu-item
                    if (!item.contains(menuItem)) {
                        item.classList.remove('is-opened');
                    }
                });
                if (openMenus.length > 0 && megaMenu.getAttribute('data-delay-dropdowns')) {
                    const delay = parseFloat(megaMenu.getAttribute('data-delay-dropdowns')) * 1000;
                    setTimeout(() => {
                        menuItem.classList.toggle('is-opened');
                    }, delay);
                } else {
                    menuItem.classList.toggle('is-opened');
                }
                return;
            }

            document.querySelectorAll('.menu-item.has-click-trigger.is-opened').forEach(item => {
                item.classList.remove('is-opened');
            });

            if (target.classList.contains('menu-item-toggle')) {
                console.log('toggle-mobile-menu');
                const menuItem = target.closest('.menu-item');
                const dropdown = menuItem.querySelector('.dropdown-wrapper');
                if (menu.classList.contains('is-mobile') || !menuItem.classList.contains('has-click-trigger')) {
                    toggleMobileMenu(target, dropdown);
                } else {
                    menuItem.classList.toggle('is-opened');
                }
            }
        });
    }

    menuToggles.forEach(toggle => {
        toggle.addEventListener('click', function (event) {
            event.preventDefault();
            const menu = toggle.closest('.megamenu');
            toggleMobileMenu(toggle, menu);
        });
    });

    function toggleMobileMenu(toggle_button, menu) {
        toggle_button.classList.toggle('is-opened');
        menu.classList.toggle('is-opened');
    }

    function setMobileMenuPosition(menus) {
        menus.forEach(menu => {
            const dropdown = menu.querySelector('.megamenu-content-wrapper');
            if (!menu.classList.contains('is-mobile')) {
                if (dropdown) {
                    dropdown.style.left = '';
                    dropdown.style.width = '';
                }
                return;
            }
            const menuCoords = menu.getBoundingClientRect();
            const left = -menuCoords.left;
            if (dropdown) {
                dropdown.style.left = left + 'px';
                dropdown.style.width = window.innerWidth + 'px';
            }
        });
    }

    showMenuToggleButton(menus);
    attachToggleActionToButtons(menus);
    setDropdownAlignment(menus);

    window.addEventListener('resize', function () {
        showMenuToggleButton(menus);
        setDropdownAlignment(menus);
    });
});