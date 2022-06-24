'use strict';

//=include ../../node_modules/jquery/dist/jquery.js
//=include ../../node_modules/device.js/dist/device.umd.js
//=include ../../node_modules/swiper/swiper-bundle.js

//=include ../modules/cheg.checkwebp/functions.js

let winHeight,
	scrollOffset = 50,
	popupOpened = false,
	popupOpenedPos = 0,
	scrollPos = 0,
	animDuration = 200,
	pageLoaded = false,
	formTitle = '',
	deviceIs = device.device;

deviceIs.addClasses(document.documentElement);

(function () {
	if ('ontouchstart' in document.documentElement) {
		$('html').addClass('touch');
	} else {
		$('html').addClass('no-touch');
	}

	const scrollSections = $('[data-scroll-section]');
	winHeight = $(window).height();
	scrollPos = $(window).scrollTop();

	// Main init
	init();

	if (deviceIs.desktop) {
		$(window).on('resize', function () {
			vhFix();
		});
	} else {

	}

	if (deviceIs.mobile || deviceIs.tablet) {
		vhFix();
		$(window).on('orientationchange', function () {
			vhFix();
		});
	}

	$(window).on('resize', function () {
		winHeight = $(window).height();
		scrollPos = $(window).scrollTop();

		checkSectionSelected();
	});
	$(window).on('scroll', function () {
		scrollPos = $(window).scrollTop();
		checkSectionSelected();
	});

	$(window).trigger('resize').trigger('scroll');

	/*// Scroll to element
	$(document).on('click', 'a[href^="#"]', function (e) {
		e.preventDefault();
		var target = $(this).attr('href');
		if ($(target).length) {
			var targetPos = $(target).offset().top - scrollOffset;
			$('html, body').animate({
				scrollTop: targetPos
			}, 700);
		}
	});*/


	// Scroll-навигация по странице
	var navScrollScrolling = false;
	function getTargetTop(target) {
		return $('[data-scroll-section="'+target+'"]').first().offset().top - scrollOffset;
	}
	$('.nav-scroll[data-scroll-link]').on('click', function(e) {
		var target = $(this).attr('data-scroll-link'), scrollTarget = 0;
		if ($('[data-scroll-section="'+target+'"]').length) {
			$('.nav-scroll[data-scroll-link]').removeClass('active');
			$('.nav-scroll[data-scroll-link="'+target+'"]').addClass('active');
			navScrollScrolling = true;
			scrollTarget = getTargetTop(target);
			$('html, body').animate({scrollTop:scrollTarget}, 700, function() {
				navScrollScrolling = false;
			});
		}
		e.preventDefault();
	});
	function checkSectionSelected() {
		var threshold = parseInt(winHeight * 0.3);

		if (!navScrollScrolling) {
			scrollSections.each(function() {
				var scrollSection = $(this),
					scrollName = scrollSection.attr('data-scroll-section'),
					scrollLink = $('[data-scroll-link="'+scrollName+'"].nav-scroll'),
					scrollSectionHeight = scrollSection.outerHeight(),
					scrollTarget = getTargetTop(scrollName);
					
				if (scrollPos > scrollTarget - threshold && scrollPos < scrollTarget + scrollSectionHeight - threshold) {
					scrollLink.addClass('active');
				} else {
					scrollLink.removeClass('active');
				}
			});
		}
	}
})(jQuery);

$(window).on('load', function () {
	setTimeout(function () {
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

/* File attach */
function attachInit(att) {
	let attInp = att.find('input'),
		attPh = att.find('.ui-attach__ph'),
		attFile = att.find('.ui-attach__file');

	att.on('click',function() {
		//attInp.trigger('click');
	});

	attInp.on('change', function(e) {
		let fileName = '';
		if (e.target.value) {
			fileName = e.target.value.split('\\').pop();
		}
		if (fileName) {
			attFile.text(fileName);

			att.addClass('attached');
		} else {
			att.removeClass('attached');
		}
	});

	att.data('init', true);
}

/*! Team */
function teamInit(block) {
	let slider = block.find('.team__slider'),
		sliderS,
		init = false,
		wrapper = block.find('.team__wrapper'),
		slides = block.find('.team-item'),
		sliderOpts = {
			slidesPerView: 3,
			loop: false,
			speed: 500,
			spaceBetween: 30,
			init: true,
			navigation: {
				nextEl: block.find('.ui-nav__item--next').get(0),
				prevEl: block.find('.ui-nav__item--prev').get(0),
			},
		};

	$(window).on('resize', function() {
		if (window.matchMedia('(min-width:601px)').matches && !init) {
			wrapper.addClass('swiper-wrapper');
			slides.addClass('swiper-slide');

			sliderS = new Swiper(slider.get(0), sliderOpts);

			init = true;
		}

		if (window.matchMedia('(max-width:600px)').matches && init) {
			sliderS.destroy(true, true);

			wrapper.removeClass('swiper-wrapper');
			slides.removeClass('swiper-slide');

			init = false;
		}
	});

	$(window).trigger('resize');

	block.data('init', true);
}

/*! Intro */
function introInit(intro) {
	let block = intro.find('.intro__block'),
		layer = block.find('.intro__layer');

	for (let i = 0; i < 8; i++) {
		block.append(layer.clone());
	}

	intro.data('init', true);
}

/*! Portfolio */
function portInit(block) {
	let list = block.find('.port__list'),
		btn = block.find('.port__btn .ui-btn'),
		btnText = btn.find('.ui-btn__text'),
		short = 0;
	
	$(window).on('resize',function() {
		let cols = 4,
			rows = 2,
			full = 0;

		short = 0

		if (window.matchMedia('(max-width:1000px)').matches) {
			cols = 3;
		}

		if (window.matchMedia('(max-width:700px)').matches) {
			cols = 2;
		}

		if (window.matchMedia('(max-width:500px)').matches) {
			cols = 1;
			rows = 3;
		}

		list.addClass('sizing');

		//short = list.find('.port-item').eq(0).outerHeight() +  list.find('.port-item').eq(cols).outerHeight();

		short = list.find('.port-item').eq(0).outerHeight();

		for (let i = 1; i < rows; i++) {
			short += list.find('.port-item').eq(i * cols).outerHeight();

			//console.log(i * cols + 1);
		}

		full = list.outerHeight();

		list.get(0).style.setProperty('--hs', short + 'px');
		list.get(0).style.setProperty('--hf', full + 'px');

		
		list.removeClass('sizing');
	});

	$(window).trigger('resize');

	btn.on('click',function() {
		if (!block.hasClass('active')) {
			block.addClass('active');
			btnText.text('Hide');
		} else {
			block.removeClass('active');
			btnText.text('Show more projects');

			$('html, body').animate({
				scrollTop: list.offset().top + short - 50
			}, 500);
		}
	});

	block.data('init', true);
}

/*! Init */
function init() {
	// Intro
	$('.intro').each(function () {
		if ($(this).data('init') !== true) {
			introInit($(this));
		}
	});

	// File attach
	$('.ui-attach').each(function () {
		if ($(this).data('init') !== true) {
			attachInit($(this));
		}
	});

	// Team
	$('.team').each(function () {
		if ($(this).data('init') !== true) {
			teamInit($(this));
		}
	});

	// Portfolio
	$('.port').each(function () {
		if ($(this).data('init') !== true) {
			portInit($(this));
		}
	});

	if ('ontouchstart' in document.documentElement) {
		$('.port-item').each(function() {
			$(this).attr('ontouchstart', '');
		});
	}
}