/*! Mobile menu */
let menuOpened = false;
/*! Open menu */
function menuOpen() {
	popupOpenedPos = $(window).scrollTop();

	$('body').addClass('body--menu-opened');
	scrollLock();

	menuOpened = true;
}
/*! Close menu */
function menuClose() {
	$('body').removeClass('body--menu-opened');
	scrollLock('unlock');

	if (deviceIs.ios) {
		$(window).scrollTop(popupOpenedPos);
	}

	menuOpened = false;
}