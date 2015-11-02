(function () {
    var getHTML5ValidationRules = function(el) {
        var $el = $(el);
        var type = $el.attr('type') || 'text';
        var rules = {};

        switch(type) {
            case 'number':
                rules.minValue = $el.attr('min') ? $el.attr('min') : null;
                rules.maxValue = $el.attr('max') ? $el.attr('max') : null;

            case 'text':
                rules.minLength = $el.attr('minlength') ? $el.attr('minlength') : null;
                rules.maxLength = $el.attr('maxlength') ? $el.attr('maxlength') : null;

            default: // text
                rules.required = $el.attr('required') ? true : false;
                rules.pattern = $el.attr('pattern') ? $el.attr('pattern') : null;
                rules.fixLength = $el.attr('length') ? $el.attr('length') : null;
                break;
        }

        if($el.data('validate-rule') == 'card-number') {
            rules.cardNumber = true;
        }

        return rules;
    };

    var isValid = function(el) {
        var $el = $(el);
        var value = $el.val();
        rules = getHTML5ValidationRules($el) || {};
        var rules_failed = [];
        var valid = true;

        if($el.attr('disabled') == true || $el.attr('disabled') == 'disabled' || $el.hasClass('hidden') || $el.attr('type') == 'hidden') {
            return {result: valid, rules_failed: rules_failed, rules: rules};
        }

        // Filter input
        var filter = $el.data('validate-filter');
        if(filter) {
            var filter_regexp = new RegExp(filter, 'gi');
            value = value.replace(filter_regexp, '');
        }

        // Validate
        if(rules.required == true) {
            if(!value) {
                rules_failed.push('required');
                valid = false;
            }
        }

        if(rules.minValue && rules.minValue !== null) {
            if(parseInt(value, 10) < rules.minValue) {
                rules_failed.push('minValue');
                valid = false;
            }
        }

        if(rules.maxValue && rules.maxValue !== null) {
            if(parseInt(value, 10) > rules.maxValue) {
                rules_failed.push('maxValue');
                valid = false;
            }
        }

        if(rules.minLength && rules.minLength !== null) {
            if(value.length < rules.minLength) {
                rules_failed.push('minLength');
                valid = false;
            }
        }

        if(rules.maxLength && rules.maxLength !== null) {
            if(value.length > rules.maxLength) {
                rules_failed.push('maxLength');
                valid = false;
            }
        }

        if(rules.fixLength && rules.fixLength !== null) {
            if(value.length != rules.fixLength) {
                rules_failed.push('fixLength');
                valid = false;
            }
        }

        if(rules.cardNumber == true) {
            var numericDashRegex = /^[\d\-\s]+$/;
            if (numericDashRegex.test(value)) {
                var nCheck = 0, nDigit = 0, bEven = false;
                var strippedField = value.replace(/\D/g, "");

                for (var n = strippedField.length - 1; n >= 0; n--) {
                    var cDigit = strippedField.charAt(n);
                    nDigit = parseInt(cDigit, 10);
                    if (bEven) {
                        if ((nDigit *= 2) > 9) nDigit -= 9;
                    }

                    nCheck += nDigit;
                    bEven = !bEven;
                }

                if((nCheck % 10) !== 0) {
                    rules_failed.push('cardNumber');
                    valid = false;
                }
            } else {
                rules_failed.push('cardNumber');
                valid = false;
            }
        }

        if(rules.pattern && rules.pattern !== null) {
            var regexp = new RegExp(rules.pattern, 'g');
            if(!regexp.test(value)) {
                rules_failed.push('pattern');
                valid = false;
            }
        }
        return {result: valid, rules_failed: rules_failed, rules: rules};
    };

    $.fn.isValid = function () {
        var $this = $(this);

        if($this.is('form')) {
            var result = true;
            $($this.data('validation-inputs')).each(function(index, el) {
                if(isValid(el).result == false) {
                    result = false;
                }
            });
            return result;
        } else if($this.is('input')) {
            return isValid(this).result;
        }

        return null;
    };

    $.fn.getFirstInvalid = function () {
        var $this = $(this);

        if(!$this.is('form')) {
            return false;
        }

        var invalid_field;
        $($this.data('validation-inputs')).each(function(index, el) {
            if(!isValid(el).result) {
                invalid_field = el;
                return false;
            }
        });

        if(invalid_field) {
            return invalid_field
        }

        return false;
    };

    $.fn.validate = function (events) {
        var $this = $(this);

        if($this.is('form')) {
            $this.attr('novalidate', true);

            $($this.data('validation-inputs')).each(function(index, el) {
                $(el).validate();
            });

            return $this;
        } else if($this.is('input')) {
            var $form = $(this).closest('form');
            $form.attr('novalidate', true);

            events = events || 'change'

            if($this.data('validation-active') == true) {
                $this.trigger('validate');
                return $this;
            }
            $this.data('validation-active', true);

            var inputs = $form.data('validation-inputs') || [];
            inputs.push($this);
            $form.data('validation-inputs', inputs);

            $this.on(events + ' validate', function(event) {
                event = event || {};
                $validated_element = $(this);

                // Run onChange validation only on non-empty fields
                if($validated_element.val() == '' && event.type == 'change') {
                    $validated_element.trigger('validation-skipped');
                    return $this;
                }

                var validation_result = isValid($validated_element);
                $validated_element.trigger('validating');

                if(validation_result.result == true) {
                    $validated_element.trigger('valid');
                    $form.trigger('field_valid');
                } else {
                    $form.trigger('field_invalid');
                    $validated_element.trigger('invalid', [validation_result.rules_failed.slice(0), rules]);
                }

                $form.trigger('change', [this, $.extend(validation_result)]);
            });

            return $this;
        }

        return false;
    };
})();
