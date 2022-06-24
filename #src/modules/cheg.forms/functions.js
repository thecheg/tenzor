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

/*! Send forms */
function formInit(form) {
	// add errors to fields
	form.find('.ui-form-field--required').each(function () {
		$(this).append('<div class="ui-form-errors"><p class="ui-form-errors__item ui-form-errors__item--required">Обязательное поле</p></div>');
	});

	// add * to required fields
	form.find('.ui-form-field--required').each(function () {
		$(this).find('.ui-input__placeholder').append(' *');
	});

	// check if is filled
	form.on('submit', function (e) {
		e.preventDefault();

		var formType = form.attr('data-form-type'),
			valid = formValidator(form.get(0));

		// if check passed
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
		// if not passed
		else {
			form.find('.ui-form-field--error').first().find('input, textarea').focus();
		}
	});

	form.data('init', true);
}
/*! Clear form */
function clearForm(form) {
	form.find('.ui-form-field--error').removeClass('.ui-form-field--error');

	form.find('.ui-form-field').find('input, textarea').val('').trigger('change');
}

/*! Form validator */
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