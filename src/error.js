(function() {
  var error_messages = {
    'default': {
      'default': "Вы ввели неверные данные",
      'required': "Это поле обязательно к заполнению",
      'pattern': "Вы ввели неверные данные",
      'minLength': "Длинна поля меньше максимальной",
      'maxLength': "Длинна поля больше максимальной",
      'fixLength': "Длинна поля не соответствует заданой",
      'minValue': "Значение меньше минимального",
      'maxValue': "Превышено максимальное значение",
    }
  };

  var error_groups = {};

  $.mergeErrorMessages = function(messages) {
    messages = messages || {};
    error_messages = $.extend(error_messages, messages);
  };

  $.mergeErrorGroups = function(groups) {
    groups = groups || {};
    error_groups = $.extend(error_groups, groups);
  };

  var getInputGroup = function(input_name) {
    return error_groups[input_name] || input_name || 'default';
  };

  var getInputName = function(input) {
    return $(input).attr('name') || 'default';
  };

  var errorMessageElement = function(text, input_name, group_name) {
    return $('<label class="error ' + group_name + '-error" for="' + input_name + '">' + text + '</label>');
  };

  var findErrorElement = function(for_el) {
    var $el = $(for_el);
    var input_name = getInputName($el);
    var group_name = getInputGroup(input_name);

    return $('.' + group_name + '-error');
  };

  $.fn.hasError = function() {
    return (findErrorElement(this).length > 0);
  };

  $.fn.getErrorText = function() {
    return $(this).hasError() ? findErrorElement(this).text() : null;
  };

  $.fn.showError = function (message_key, template_data) {
    var $this = $(this);
    var input_name = getInputName($this);
    var group_name = getInputGroup(input_name);
    message_key = message_key || 'default';
    template_data = template_data || {};

    var error_message_group = error_messages[group_name] || error_messages['default'];
    var error_message = error_message_group[message_key] || error_messages['default'][message_key] || message_key;

    // Parse error templates
    error_message = $.parseTemplate(error_message, template_data);

    $this.addClass('error');
    var error_el = errorMessageElement(error_message, input_name, group_name);
    if($this.hasError()) {
      findErrorElement(this).replaceWith(error_el)
    } else {
      $this.after(error_el);
    }

    return $this;
  };

  $.fn.getErrorGroup = function() {
    var $this = $(this);
    var input_name = getInputName($this);
    var group_name = getInputGroup(input_name);
    var group_elements = [];

    for (var element_name in error_groups) {
      if(error_groups[element_name] == group_name) {
        group_elements.push($('[name=' + element_name + ']'));
      }
    }

    return $(group_elements);
  }

  $.fn.removeError = function () {
    var $this = $(this);
    if($this.hasClass('error')) {
      $this.removeClass('error');
      findErrorElement($this).remove();

    }
    return $this;
  };
})();
