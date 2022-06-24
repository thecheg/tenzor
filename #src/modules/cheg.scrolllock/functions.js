/*! Scroll lock */
function scrollLock(type) {
	if (type == 'unlock') {
		$('body').removeClass('body--fixed');
	} else {
		$('body').addClass('body--fixed');
	}
}