(function () {
  'use strict';

  /* ---------------------------------------------------------------------
     Маска телефона: +7 (___) ___-__-__
     --------------------------------------------------------------------- */
  function formatPhone(raw) {
    var digits = raw.replace(/\D/g, '');
    if (digits.charAt(0) === '8') digits = '7' + digits.slice(1);
    if (digits.charAt(0) !== '7') digits = '7' + digits;
    digits = digits.slice(0, 11);

    var rest = digits.slice(1);
    var out = '+7';
    if (rest.length) out += ' (' + rest.slice(0, 3);
    if (rest.length >= 3) out += ')';
    if (rest.length > 3) out += ' ' + rest.slice(3, 6);
    if (rest.length > 6) out += '-' + rest.slice(6, 8);
    if (rest.length > 8) out += '-' + rest.slice(8, 10);
    return out;
  }

  function isValidPhone(value) {
    var digits = value.replace(/\D/g, '');
    return digits.length === 11 && (digits.charAt(0) === '7' || digits.charAt(0) === '8');
  }

  function isValidName(value) {
    var v = value.trim();
    var letters = v.match(/[a-zA-Zа-яА-ЯёЁ]/g);
    return !!letters && letters.length >= 2 && /^[a-zA-Zа-яА-ЯёЁ]+(?:[ '\-][a-zA-Zа-яА-ЯёЁ]+)*$/.test(v);
  }

  document.querySelectorAll('input[data-phone-mask]').forEach(function (input) {
    input.addEventListener('focus', function () {
      if (!input.value) input.value = '+7 (';
    });
    input.addEventListener('input', function () {
      var pos = input.selectionStart;
      var before = input.value.length;
      input.value = formatPhone(input.value);
      var after = input.value.length;
      var diff = after - before;
      if (pos !== null) {
        var nextPos = Math.max(0, Math.min(pos + diff, input.value.length));
        input.setSelectionRange(nextPos, nextPos);
      }
    });
    input.addEventListener('blur', function () {
      if (input.value.replace(/\D/g, '') === '7') input.value = '';
    });
  });

  /* ---------------------------------------------------------------------
     Валидация и отправка
     --------------------------------------------------------------------- */
  var errorId = 0;

  function fieldForRow(row) {
    return row && row.querySelector('input:not([type="hidden"]), select, textarea');
  }

  function setError(row, message) {
    if (!row) return;
    row.classList.add('has-error');
    var msg = row.querySelector('.form-error-msg');
    var field = fieldForRow(row);
    if (msg) {
      if (!msg.id) msg.id = (field && field.id ? field.id : 'form-field-' + (++errorId)) + '-error';
      msg.textContent = message;
      if (field) field.setAttribute('aria-describedby', msg.id);
    }
    if (field) field.setAttribute('aria-invalid', 'true');
  }

  function clearError(row) {
    if (!row) return;
    row.classList.remove('has-error');
    var msg = row.querySelector('.form-error-msg');
    var field = fieldForRow(row);
    if (msg) msg.textContent = '';
    if (field) {
      field.removeAttribute('aria-invalid');
      if (msg && field.getAttribute('aria-describedby') === msg.id) field.removeAttribute('aria-describedby');
    }
  }

  function validateForm(form) {
    var ok = true;

    var nameInput = form.querySelector('input[name="name"]');
    if (nameInput) {
      var nameRow = nameInput.closest('.form-row');
      if (!isValidName(nameInput.value)) {
        setError(nameRow, 'Введите имя (минимум 2 буквы)');
        ok = false;
      } else {
        clearError(nameRow);
      }
    }

    var phoneInput = form.querySelector('input[name="phone"]');
    if (phoneInput) {
      var phoneRow = phoneInput.closest('.form-row');
      if (!isValidPhone(phoneInput.value)) {
        setError(phoneRow, 'Проверьте номер телефона');
        ok = false;
      } else {
        clearError(phoneRow);
      }
    }

    var categorySelect = form.querySelector('select[name="category"]');
    if (categorySelect && categorySelect.hasAttribute('required')) {
      var catRow = categorySelect.closest('.form-row');
      if (!categorySelect.value) {
        setError(catRow, 'Выберите направление');
        ok = false;
      } else {
        clearError(catRow);
      }
    }

    var consent = form.querySelector('input[name="consent"]');
    if (consent) {
      var consentRow = consent.closest('.form-row');
      if (!consent.checked) {
        setError(consentRow, 'Нужно согласие на обработку данных');
        ok = false;
      } else {
        clearError(consentRow);
      }
    }

    return ok;
  }

  document.querySelectorAll('form.form').forEach(function (form) {
    var submitBtn = form.querySelector('button[type="submit"]');
    var statusBox = form.querySelector('.form-status');

    form.querySelectorAll('.form-row input, .form-row select, .form-row textarea').forEach(function (field) {
      var eventName = field.type === 'checkbox' || field.tagName === 'SELECT' ? 'change' : 'input';
      field.addEventListener(eventName, function () {
        clearError(field.closest('.form-row'));
        if (statusBox && !form.querySelector('.has-error')) {
          statusBox.textContent = '';
          statusBox.className = 'form-status';
          statusBox.setAttribute('role', 'status');
        }
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!validateForm(form)) {
        var firstError = form.querySelector('.has-error input, .has-error select');
        if (firstError) firstError.focus();
        if (statusBox) {
          statusBox.textContent = 'Проверьте, пожалуйста, поля формы.';
          statusBox.className = 'form-status is-error';
          statusBox.setAttribute('role', 'alert');
        }
        return;
      }

      if (statusBox) {
        statusBox.textContent = '';
        statusBox.className = 'form-status';
        statusBox.setAttribute('role', 'status');
      }
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.dataset.originalText = submitBtn.textContent;
        submitBtn.textContent = 'Отправляем…';
      }

      // Заглушка отправки: реальный backend ещё не подключён.
      // Ничего никуда не отправляется — данные не покидают браузер.
      var payload = {
        name: (form.querySelector('input[name="name"]') || {}).value,
        phone: (form.querySelector('input[name="phone"]') || {}).value,
        category: (form.querySelector('[name="category"]') || {}).value,
        page: window.location.pathname,
      };

      window.setTimeout(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = submitBtn.dataset.originalText;
        }
        form.setAttribute('data-state', 'success');
        var panel = form.querySelector('.form-success-panel');
        if (panel) panel.setAttribute('tabindex', '-1'), panel.focus();
        if (window.console && window.console.info) {
          console.info('[Авто-Класс] заявка (локальная заглушка, никуда не отправлена):', payload);
        }
      }, 650);
    });

    var resetBtn = form.querySelector('[data-form-reset]');
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        form.reset();
        form.removeAttribute('data-state');
        form.querySelectorAll('.form-row').forEach(clearError);
        var firstInput = form.querySelector('input[name="name"]');
        if (firstInput) firstInput.focus();
      });
    }
  });
})();
