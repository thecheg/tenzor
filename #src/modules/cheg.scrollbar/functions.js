/*! Define scrollbar width */
var scrollBarWidth = 0;
function scrollbarWidth() {
	var div = $('<div style="width:50px;height:50px;overflow:hidden;position:absolute;top:-200px;left:-200px;"><div style="height:100px;"></div>');
	$('body').append(div);
	var w1 = $('div', div).innerWidth();
	div.css('overflow-y', 'scroll');
	var w2 = $('div', div).innerWidth();
	$(div).remove();

	var bodyHeight = parseInt($('.app').height());

	if (bodyHeight > winHeight) {
		scrollBarWidth = w1 - w2;
	} else {
		scrollBarWidth = 0;
	}

	document.documentElement.style.setProperty('--sbW', scrollBarWidth + 'px');
}