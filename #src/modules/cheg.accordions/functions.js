/*! Accordions */
function accordionInit(acc) {
	var items = acc.find('.ui-accordion__item'),
		triggers = acc.find('.ui-accordion__trigger'),
		panels = acc.find('.ui-accordion__panel'),
		initialized = false,
		collapsable = true,
		connected = false,
		itemF;

	// if all items closing disabled
	if (acc.hasClass('not-collapsable')) {
		collapsable = false;
	}

	// if connected blocks exist
	if (acc.attr('data-acc')) {
		connected = true;
	}

	// раскрываем изначальный активный пункт
	if (!acc.hasClass('collapsed')) {
		if (!acc.find('.ui-accordion__item.active').length || acc.find('.ui-accordion__item.active').length > 1) {
			itemF = items.first();
		} else {
			itemF = acc.find('.ui-accordion__item.active');
		}

		itemAction(itemF, 'open');
	} else {
		initialized = true;
	}

	// open/close item
	function itemAction(item, action) {
		var slideSpeed = animDuration;

		if (!initialized) {
			slideSpeed = 0;
		}

		if (action == 'open') {
			if (initialized) {
				panels.hide();
				var itemPos = item.offset().top - scrollOffset - 30;
				acc.find('.ui-accordion__item.active').find('.ui-accordion__panel').show();
				setTimeout(function () {
					$('html, body').animate({
						scrollTop: itemPos
					}, animDuration);
				}, 30);
			}

			setTimeout(function () {
				items.removeClass('active');
				item.addClass('active');

				panels.slideUp(slideSpeed);
				item.find('.ui-accordion__panel').slideDown(slideSpeed);
			}, 30);

			if (connected) {
				var accID = acc.attr('data-acc'),
					itemID = item.attr('data-acc-item'),
					accCon = $('[data-acc-con="' + accID + '"]'),
					accConItems = accCon.find('[data-acc-con-item]');

				accConItems.removeClass('active');
				accCon.find('[data-acc-con-item="' + itemID + '"]').addClass('active');
			}
		} else {
			item.removeClass('active');
			panels.slideUp(slideSpeed);
		}

		if (!initialized) {
			initialized = true;
		}
	}

	// clicking on trigger
	triggers.on('click', function () {
		var item = $(this).closest('.ui-accordion__item');

		if (!item.hasClass('active')) {
			itemAction(item, 'open');
		} else {
			if (collapsable) {
				itemAction(item, 'close');
			}
		}
	});

	acc.data('init', true);
}