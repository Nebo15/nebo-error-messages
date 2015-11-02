# Nebo Error Messages

Simple library for error messages to be used with our form validator.

## Methods
- ```$.mergeErrorMessages({'input_name':{'message_key': 'Error Text'}})``` - set error message texts.
- ```$.mergeErrorGroups({'input_name_one': 'group_name', 'input_name_two': 'group_name'})``` - join few inputs into one group. Group would have single error message.
- bool ```$elOrForm.hasError()``` 
- string ```$el.getErrorText()```
- $el ```$el.showError(message_key, template_data)```
- string ```$el.getErrorGroup()``` return error group name for selected input
- ```$el.removeError()```

### Example 
```
// Set error messages from language file
$.mergeErrorMessages({
  'pan': {
    'required': "Card number is required.",
    'pattern': "Invalid card number.",
    'cardNumber': "Invalid card number.",
    'minLength': "Card number should consist at least {{minLength}} characters.",
    'maxLength': "Card number should consist no more than {{maxLength}} characters.",
  },
  'cvv': {
    'required': "CVV/CVC2 code is required.",
    'minLength': "CVV/CVC2 should be {{minLength}} characters long.",
    'maxLength': "CVV/CVC2 should be {{maxLength}} characters long."
  },
  'default': {
    'default': "Invalid data",
    'required': "This field is required",
    'pattern': "Invalid data",
    'minLength': "This field should consist at least {{minLength}} characters.",
    'maxLength': "This field should consist no more than {{maxLength}} characters.",
    'fixLength': "This field should be {fixLength} characters long.",
    'minValue': "Value should be at least {{minValue}}.",
    'maxValue': "Value should be no more than {{maxValue}}.",
    'cardNumber': "Invalid card number.",
    'unsupportedCardVendor': "We accept only Visa, MasterCard and Maestro cards."
  }
});

// Join exp date error messages in one group
$.mergeErrorGroups({
  'exp_date_m': 'exp_date',
  'exp_date_y': 'exp_date'
});

$('input[name=cvv]').showError('minLength', {minLength: 3})
````
