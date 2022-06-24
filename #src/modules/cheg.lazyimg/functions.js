/*! lazy-load */
function imgInit() {
	$('img[data-src]').each(function () {
		var img = $(this);
		img.attr('src', img.attr('data-src'));
		img.on('load', function () {
			img.removeAttr('data-src');
		});
	});
}