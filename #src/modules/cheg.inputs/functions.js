/*! Floating placeholder */
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