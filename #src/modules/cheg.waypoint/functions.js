/*! jQuery Simple Waypoint 1.0.0 by github.com/thecheg/ */
(function($){
	jQuery.fn.simpleWaypoint = function(options) {
		options = $.extend({
			position: 0,
			onDown: function() {},
			onUp: function() {}
		}, options);

		var element = $(this),
			position = 0;

		if (typeof options.position == 'function') {
			position = options.position.call(this);
		} else {
			position = options.position;
		}

		$(window).on('resize',function() {
			if (typeof options.position == 'function') {
				position = options.position.call(this);
			} else {
				position = options.position;
			}
		});

		var activate = function(){
			$(window).on('scroll',function() {
				if ($(window).scrollTop() > position) {
					if (typeof options.onDown == 'function') {
						options.onDown.call(this);
					}
				} else {
					if (typeof options.onUp == 'function') {
						options.onUp.call(this);
					}
				}
			});
		}
		return this.each(activate);
	};
})(jQuery);