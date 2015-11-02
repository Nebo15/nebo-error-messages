# Nebo Error Messages

Simple library for form validation error messages. 
### Example 

````

    // Set error messages from language file
    $.mergeErrorMessages(lang.error_messages || {});

    // Join exp date error messages in one group
    $.mergeErrorGroups({
        'exp_date_m': 'exp_date',
        'exp_date_y': 'exp_date'
    });
    
````
