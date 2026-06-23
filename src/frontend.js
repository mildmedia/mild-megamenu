document.addEventListener('DOMContentLoaded', function () {
    const menus = document.querySelectorAll('.megamenu');
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
                menu.querySelectorAll('.menu-item.has-children').forEach(item => {
                    item.classList.add('has-click-trigger');
                });
            } else {
                toggleButtonWrapper.classList.add('is-hidden');
                menu.classList.remove('is-mobile', 'is-opened');
                menu.querySelectorAll('.menu-item.has-children').forEach(item => {
                    item.classList.remove('has-click-trigger', 'is-opened');
                });
            }
        });
    }

    function attachToggleActionToButtons() {

        let touchStartX = 0;
        let touchStartY = 0;

        function getHeaderContext() {
            const headerElement = document.querySelector('.wp-site-blocks')?.querySelector('header');
            const headerWithMultipleMenus = headerElement?.querySelectorAll('.megamenu').length > 1;
            return {
                headerWithMultipleMenus,
                headerMenus: headerWithMultipleMenus ? headerElement.querySelectorAll('.megamenu') : [],
            };
        }

        function toggleItem(clickedItem) {
            const { headerWithMultipleMenus, headerMenus } = getHeaderContext();

            document.querySelectorAll('.menu-item.has-click-trigger.is-opened').forEach(item => {
                if (!item.contains(clickedItem)) {
                    item.classList.remove('is-opened');
                }
            });

            clickedItem.classList.toggle('is-opened');

            const parentMenu = clickedItem.closest('.megamenu');

            if (!parentMenu.classList.contains('dropdown-opened')) {
                setTimeout(() => {
                    if (headerWithMultipleMenus) {
                        headerMenus.forEach(menu => menu.classList.add('dropdown-opened'));
                    } else {
                        parentMenu.classList.add('dropdown-opened');
                    }
                }, 700);
            } else {
                if (headerWithMultipleMenus) {
                    headerMenus.forEach(menu => {
                        menu.classList.toggle('dropdown-opened', clickedItem.classList.contains('is-opened'));
                    });
                } else {
                    parentMenu.classList.toggle('dropdown-opened', clickedItem.classList.contains('is-opened'));
                }
            }
        }

        function closeAll() {
            const { headerWithMultipleMenus, headerMenus } = getHeaderContext();
            document.querySelectorAll('.menu-item.has-click-trigger.is-opened').forEach(item => {
                const parentMenu = item.closest('.megamenu');
                if (headerWithMultipleMenus) {
                    headerMenus.forEach(menu => menu.classList.remove('dropdown-opened'));
                } else {
                    parentMenu.classList.remove('dropdown-opened');
                }
                item.classList.remove('is-opened');
            });
        }


        // touch click
        let lastClickedItem = null;
        document.addEventListener('touchend', function (event) {
            const target = event.target;
            const clickedItem = target.closest('.menu-item.has-children');
            if (clickedItem) {
                if (lastClickedItem == clickedItem) {
                    event.stopImmediatePropagation();
                    console.log('second touchstart on menu item');
                    document.body.click();
                    lastClickedItem = null;
                    return;
                }
                lastClickedItem = clickedItem;
            }

        });


        // Handle toggle via click for desktop (mouse), and as fallback for touch
        // when touchend didn't call preventDefault (real link navigation case).
        document.addEventListener('click', function (event) {
            const target = event.target;
            const clickedItem = target.closest('.menu-item.has-click-trigger');

            if (clickedItem) {
                if (target.closest('.dropdown-wrapper')) return;

                const clickedItemMenu = clickedItem.closest('.megamenu');
                const isMobile = clickedItemMenu?.classList.contains('is-mobile');

                event.preventDefault();
                toggleItem(clickedItem);
                return;
            }

            closeAll();

            // Prevent page jump for empty links in desktop hover menu items (no click-trigger)
            const link = target.closest('.menu-item.has-children a');
            if (link) {
                const href = link.getAttribute('href');
                if (!href || href === '#') {
                    event.preventDefault();
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
    attachToggleActionToButtons();
    setDropdownAlignment(menus);

    window.addEventListener('resize', function () {
        showMenuToggleButton(menus);
        setDropdownAlignment(menus);
    });
});
