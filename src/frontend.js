document.addEventListener('DOMContentLoaded', function () {
    const menus = document.querySelectorAll('.megamenu');
    const plainMenus = document.querySelectorAll('.megamenu');

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
            console.log('click document', target);
            if (target.closest('.menu-item.has-click-trigger')) {
                event.preventDefault();
                console.log('click trigger open submenu?');
                const menuItem = target.closest('.menu-item');
                menuItem.classList.toggle('is-opened');
                return;
            }

            if (target.classList.contains('megamenu-toggle')) {
                toggleMobileMenu(target, menu);
            }
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