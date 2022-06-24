'use strict';
import jQuery from 'jquery';
import { device } from 'device.js';
import * as uiFunctions from './modules/functions.js';

window.$ = window.jQuery = jQuery;

uiFunctions.isWebp();

let winHeight,
	scrollOffset = 60,
	popupOpened = false,
	popupOpenedPos = 0,
	scrollPos = 0,
	animDuration = 200,
	pageLoaded = false,
	formTitle = '';

device.addClasses(document.documentElement);

(function () {
	if ('ontouchstart' in document.documentElement) {
		$('html').addClass('touch');
	} else {
		$('html').addClass('no-touch');
	}
	var scrollSections = $('[data-scroll-section]');

	winHeight = $(window).height();
	scrollPos = $(window).scrollTop();

	// Инициализация основных компонентов
	init();

	//popup('request');

	// Клик на бургер
	$(document).on('click', '.menu-toggle', function () {
		if (!menuOpened) {
			menuOpen();
		} else {
			menuClose();
		}
	});



	if (device.desktop) {
		
	} else {

	}


	$(window).on('resize', function () {
		winHeight = $(window).height();
		scrollPos = $(window).scrollTop();

		scrollbarWidth();
		checkSectionSelected();
		vhFix();

		if (menuOpened) {
			menuClose();
		}
	});
	$(window).on('scroll', function () {
		scrollPos = $(window).scrollTop();
		checkSectionSelected();
	});

	$(window).trigger('resize').trigger('scroll');

	// Запрет ввода любых символов, кроме 0-9, (), -, +
	$(document).on('input change paste keyup', 'input.phone-number, .send-form .ui-form-field[data-field-type="phone"] input', function () {
		$(this).val(this.value.replace(/[^0-9\+ ()\-]/, ''));
	});

	// Прокрутка к элементу
	$(document).on('click', 'a[href*="#"]', function (e) {
		e.preventDefault();
		var target = $(this).attr('href');
		if ($(target).length) {
			var targetPos = $(target).offset().top - scrollOffset;
			$('html, body').animate({
				scrollTop: targetPos
			}, 500);
		}
	});

	// Открытие попапа
	$(document).on('click', '[data-popup-open]', function () {
		popup($(this).attr('data-popup-open'));
	});

	// Закрытие попапа при клике на крестик
	$(document).on('click', '.popup__close', function () {
		popupClose();
	});

	// Закрытие попапа при клике на фон
	$(document).on('click', '.popup', function (e) {
		if (!$(e.target).closest('.popup__content').length) {
			popupClose();
			e.stopPropagation();
		}
	});

	// Закрытие попапа по нажатию на Esc
	$(document).keyup(function (e) {
		if (e.key === 'Escape') {
			if (popupOpened) {
				popupClose();
			}
		}
	});

	// Scroll-навигация по странице
	var navScrollScrolling = false;

	function getTargetTop(target) {
		return $('[data-scroll-section="' + target + '"]').first().offset().top - scrollOffset;
	}
	$('.nav-scroll[data-scroll-link]').on('click', function (e) {
		var target = $(this).attr('data-scroll-link'),
			scrollTarget = 0;
		if ($('[data-scroll-section="' + target + '"]').length) {
			menuOpened = false;
			scrollLock('unlock');
			$('.nav-scroll[data-scroll-link]').closest('li').removeClass('active');
			$('.nav-scroll[data-scroll-link="' + target + '"]').closest('li').addClass('active');
			navScrollScrolling = true;
			scrollTarget = getTargetTop(target);
			$('html, body').animate({
				scrollTop: scrollTarget
			}, 700, function () {
				navScrollScrolling = false;
			});
		}
		e.preventDefault();
	});

	function checkSectionSelected() {
		var threshold = parseInt(winHeight * 0.3);

		if (!navScrollScrolling) {
			scrollSections.each(function () {
				var scrollSection = $(this),
					scrollName = scrollSection.attr('data-scroll-section'),
					scrollLink = $('[data-scroll-link="' + scrollName + '"].nav-scroll'),
					scrollSectionHeight = scrollSection.outerHeight(),
					scrollTarget = getTargetTop(scrollName);

				if (scrollPos > scrollTarget - threshold && scrollPos < scrollTarget + scrollSectionHeight - threshold) {
					scrollLink.parent('li').addClass('active');
				} else {
					scrollLink.parent('li').removeClass('active');
				}
			});
		}
	}
})(jQuery);

$(window).on('load', function () {
	setTimeout(function () {
		$('.preloader').fadeOut(1000, function () {
			$(this).remove();
		}); // скрываем прелоадер
		$('body').addClass('body--page-loaded');
		pageLoaded = true;
		$(window).trigger('scroll');
	}, 300);
});

/*! vh fix */
function vhFix() {
	$('body').append('<div class="vh-fix" style="position:fixed;width:1px;left:-9999px;top:0;bottom:0;pointer-events:none;opacity:0;visibility:hidden;" />');

	var vh = $('.vh-fix').height() * 0.01;
	document.documentElement.style.setProperty('--vh', vh + 'px');

	$('.vh-fix').remove();
}

/*! Табы */
function tabsInit(tabs) {
	var pref = '.ui-tabs',
		prefItem = pref+'__tab',
		prefLink = pref+'__link',
		items = tabs.find(prefItem),
		links = tabs.find(prefLink);

	if (!tabs.find(prefItem+'.active').length || tabs.find(prefItem+'.active').length > 1) {
		items.removeClass('active');
		items.first().addClass('active');
	}
	
	var activeTab = tabs.find(prefItem+'.active'),
		activeTabContent = activeTab.find(prefLink).attr('data-tab');

	$(pref+'-content[data-tab="' + activeTabContent + '"]').show().addClass('active');

	links.on('click', function () {
		var link = $(this),
			item = link.closest(prefItem);
		if (!item.hasClass('active')) {
			var tabId = link.attr('data-tab');

			items.removeClass('active');
			item.addClass('active');

			$(pref+'-content[data-tab="' + tabId + '"]')
				.closest(pref+'-contents')
				.find(pref+'-content')
					.removeClass('active');

			$(pref+'-content[data-tab="' + tabId + '"]')
				.addClass('active');
		}
	});

	tabs.data('init', true);
}

/*! Аккордионы */
function accordionInit(acc) {
	var items = acc.find('.ui-accordion__item'),
		triggers = acc.find('.ui-accordion__trigger'),
		panels = acc.find('.ui-accordion__panel'),
		initialized = false,
		collapsable = true,
		connected = false,
		itemF;

	// если запрещено закрывать все пункты
	if (acc.hasClass('not-collapsable')) {
		collapsable = false;
	}

	// если есть связанные блоки
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
	}

	// открытие/закрытие пункта
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

	// при клике на триггер
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

/*! Отправка данных из формы */
function formInit(form) {
	// добавляем текст ошибок для полей
	form.find('.ui-form-field--required').each(function () {
		$(this).append('<div class="ui-form-errors"><p class="ui-form-errors__item ui-form-errors__item--required">Обязательное поле</p></div>');
	});

	// добавляем * для всех обязательных полей
	form.find('.ui-form-field--required').each(function () {
		$(this).find('.ui-input__placeholder').append(' *');
	});

	// проверяем заполнение
	form.on('submit', function (e) {
		e.preventDefault();

		var formType = form.attr('data-form-type'),
			valid = formValidator(form.get(0));

		// если прошли проверку
		if (valid) {
			var formData = new FormData(form.get(0)),
				thxPopup = form.attr('data-thxpopup') || 'thx';
			if (!formTitle || formTitle == '') {
				formTitle = 'Заявка';
			}
			formData.append('formTitle', formTitle);
			formData.append('formType', formType);
			$.ajax({
				type: 'POST',
				url: rootPath + 'php/send.php',
				dataType: 'json',
				processData: false,
				contentType: false,
				data: formData,
				success: function () {
					thx(thxPopup);
					clearForm(form);
				},
				error: function (data) {
					console.log(data);
				}
			});
		}
		// если не прошли
		else {
			form.find('.ui-form-field--error').first().find('input, textarea').focus();
		}
	});

	form.data('init', true);
}

/*! Попапы */
function popupsInit(popup) {
	popup.find('.popup__close-container')
		.prepend('<div class="cross-btn popup__close noselect" />');

	popup.data('init', true);
}

/*! "Плавающий" placeholder */
function inputInit(label) {
	var input = label.find('input, textarea'),
		field = label.closest('.ui-form-field');

	// фокус на инпуте/тексэйрии
	input.on('focus', function () {
		label.addClass('active focused');
	}).on('focusout blur change keyup input', function () {
		var value = $(this).val();
		if (value === '') {
			if (!input.is(':focus')) {
				label.removeClass('active');
			}
		} else {
			label.addClass('active');
			field.removeClass('ui-form-field--error');
		}
	}).on('focusout', function () {
		label.removeClass('focused');
	});

	input.trigger('change');

	label.data('init', true);
}

/*! lazy-загрузка изображений */
function imgInit() {
	$('img[data-src]').each(function () {
		var img = $(this);
		img.attr('src', img.attr('data-src'));
		img.on('load', function () {
			img.removeAttr('data-src');
		});
	});
}

/*! Разворачивание блоков */
function collapseInit(coll) {
	var collPrefix = 'ui-collapse',
		hidd = coll.find('.' + collPrefix + '__hidden'),
		trig = coll.find('.' + collPrefix + '__trigger'),
		trigText = trig.find('.' + collPrefix + '__trigger-text'),
		closedText = trig.attr('data-closed-text'),
		openedText = trig.attr('data-opened-text');

	trigText.text(closedText);

	trig.on('click', function () {
		if (!coll.hasClass('active')) {
			coll.addClass('active');
			hidd.slideDown(400);
			trigText.text(openedText);
		} else {
			//var collPos = coll.offset().top - scrollOffset - 30;
			//$('html, body').animate({scrollTop:collPos},500);
			coll.removeClass('active');
			hidd.slideUp(400);
			trigText.text(closedText);
		}
	});
}

/*! Инициализация */
function init() {
	// lazy-загрузка изображений
	imgInit();

	// Табы
	$('.ui-tabs').each(function () {
		if ($(this).data('init') !== true) {
			tabsInit($(this));
		}
	});

	// Аккордионы
	$('.ui-accordion').each(function () {
		if ($(this).data('init') !== true) {
			accordionInit($(this));
		}
	});

	// Попапы
	$('.popup').each(function () {
		if ($(this).data('init') !== true) {
			popupsInit($(this));
		}
	});

	// Инпуты
	$('.ui-input').each(function () {
		if ($(this).data('init') !== true) {
			inputInit($(this));
		}
	});

	// Формы
	$('.send-form').each(function () {
		if ($(this).data('init') !== true) {
			formInit($(this));
		}
	});

	// Разворачивание блоков
	$('.ui-collapse').each(function () {
		if ($(this).data('init') !== true) {
			collapseInit($(this));
		}
	});
}

/*! Определенение ширины скроллбара браузера */
var scrollBarWidth = 0;
function scrollbarWidth() {
	var div = $('<div style="width:50px;height:50px;overflow:hidden;position:absolute;top:-200px;left:-200px;"><div style="height:100px;"></div>');
	$('body').append(div);
	var w1 = $('div', div).innerWidth();
	div.css('overflow-y', 'scroll');
	var w2 = $('div', div).innerWidth();
	$(div).remove();

	var bodyHeight = parseInt($('.page').height());

	if (bodyHeight > winHeight) {
		scrollBarWidth = w1 - w2;
	} else {
		scrollBarWidth = 0;
	}

	document.documentElement.style.setProperty('--sbW', scrollBarWidth + 'px');
}

/*! Блокировка прокрутки */
function scrollLock(type) {
	if (type == 'unlock') {
		$('body').removeClass('body--fixed');
	} else {
		$('body').addClass('body--fixed');
	}
}

/*! Мобильное меню */
var menuOpened = false;
/*! Открытие меню */
function menuOpen() {
	popupOpenedPos = $(window).scrollTop();

	$('body').addClass('body--menu-opened');
	scrollLock();

	menuOpened = true;
}
/*! Закрытие меню */
function menuClose() {
	$('body').removeClass('body--menu-opened');
	scrollLock('unlock');

	if (device.ios) {
		$(window).scrollTop(popupOpenedPos);
	}

	menuOpened = false;
}

/*! Попапы */
/*! Открытие попапа */
function popup(id, form, h1, h2, btn) {
	if ($('#' + id).length) {
		popupOpenedPos = $(window).scrollTop();

		$('.popups-overlay').addClass('active');

		$('body').addClass('body--popup-opened');
		scrollLock();

		$('.popup').removeClass('active');
		var popup = $('.popup#' + id);

		if (id == 'request') {
			var defH1 = 'Оставить заявку',
				defH2 = 'Оставьте заявку, и&nbsp;наш специалист свяжется с&nbsp;вами в&nbsp;ближайшее время',
				defBtn = 'Оставить заявку';

			if (h1) {
				popup.find('.popup__title-head').html(h1);
			} else {
				popup.find('.popup__title-head').html(defH1);
			}

			if (h2) {
				popup.find('.popup__title-subtitle').html(h2);
			} else {
				popup.find('.popup__title-subtitle').html(defH2);
			}

			if (btn) {
				popup.find('.ui-btn--sendform').html(btn);
			} else {
				popup.find('.ui-btn--sendform').html(defBtn);
			}

			if (form) {
				formTitle = form;
			}
		}

		popup.scrollTop(0).addClass('active');
		popupOpened = true;
	}
}

/*! Открытие попапа с видео */
function videoPopup(id, videoUrl) {
	if ($('#' + id).length) {
		popupOpenedPos = $(window).scrollTop();

		$('.popups-overlay').addClass('active');

		$('body').addClass('body--popup-opened');
		scrollLock();

		$('.popup').removeClass('active');
		var popup = $('.popup#' + id);
		popup.find('.popup__video').html('<iframe src="' + videoUrl + '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');
		popup.scrollTop(0).addClass('active');
		popupOpened = true;
	}
}

/*! Закрытие попапов */
function popupClose() {
	$('.popups-overlay').removeClass('active');
	$('.popup').removeClass('active');


	setTimeout(function () {
		scrollLock('unlock');
		$('body').removeClass('body--popup-opened');
	}, animDuration);

	if (device.ios) {
		$(window).scrollTop(popupOpenedPos);
	}
	$('.popup__video').html('');

	$('.popup .send-form').each(function () {
		clearForm($(this));
	});

	popupOpened = false;
}

/*! Попап "Спасибо за заявку" */
function thx(thx) {
	$('.popup').removeClass('active');
	if (!thx) {
		thx = 'thx';
	}
	popup(thx);

	$('.popup .send-form').each(function () {
		clearForm($(this));
	});

}

/*! Изменяем formTitle для формы */
function changeFormTitle(form) {
	formTitle = form;
}

/*! Очистка формы */
function clearForm(form) {
	form.find('.ui-form-field--error').removeClass('.ui-form-field--error');

	form.find('.ui-form-field').find('input, textarea').val('').trigger('change');
}

/*! Валидатор формы */
function formValidator(form) {
	var $form = $(form),
		errorClass = 'ui-form-field--error',
		errorText = '',
		valid = true;

	if ($form.find('.ui-form-field--required').length) {
		$form.find('.ui-form-field--required').each(function () {
			var field = $(this),
				fieldType = field.attr('data-field-type'),
				fieldVal;

			if (field.find('input').length) {
				fieldVal = field.find('input').val();
			} else {
				fieldVal = field.find('textarea').val();
			}

			field.find('.form-errors__item--type').remove();
			if (!fieldVal) {
				field.addClass(errorClass);
				field.find('.ui-form-errors__item--type').remove();
				field.find('.ui-form-errors__item--required').show();
				valid = false;
			} else {
				field.removeClass(errorClass);
				field.find('.ui-form-errors__item--required').hide();

				if (fieldType == 'email') {
					errorText = 'Неверный формат e-mail';
					if (!/^([a-z0-9_\.-])+@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/i.test(fieldVal)) {
						field.find('.ui-form-errors').append('<p class="ui-form-errors__item--type">' + errorText + '</p>');
						field.addClass(errorClass);
						valid = false;
					} else {
						field.find('.ui-form-errors__item--type').remove();
						field.removeClass(errorClass);
					}
				}

				if (fieldType == 'phone') {
					errorText = 'Неверный формат телефона';
					if (/[^0-9\+ ()\-]/.test(fieldVal)) {
						$(this).find('.ui-form-errors').append('<p class="ui-form-errors__item--type">' + errorText + '</p>');
						field.addClass(errorClass);
						valid = false;
					} else {
						field.find('.ui-form-errors__item--type').remove();
						field.removeClass(errorClass);
					}
				}
			}
		});
	}

	return valid;
}

