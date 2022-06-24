/*! Tabs */
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