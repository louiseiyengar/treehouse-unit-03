# FSJS project 3 - Interactive Form

For this project, I created validation for form fields.  The fields will be validated as you proceed through the form, and the validation
will proceed one field at a time.  

To Note:
Validation for the name field occurs after the field loses focus.

Validation for the email and the three credit card payment fields (cc number, zip, and cvv) are done as you type in the fields.

If you do not choose an activity and either change the payment type dropdown, or type in the credit card number field, you will scroll to the Activities section and recieve an error message.

Finally, if you click the Register button, the first field to fail validation will receive focus and a validation message.  All fields are validated, and you will not be able to submit the form if all fields have not been validated. (Note that the form does not actually submit, since this was a validation project).

Screen shot of Activities section validation:
![unit03example](https://user-images.githubusercontent.com/42808209/52921794-fd00cb80-32e8-11e9-9f46-9a73be0acd7c.jpg)
