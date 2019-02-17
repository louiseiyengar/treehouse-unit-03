/******************************************
Treehouse Techdegree:
FSJS project 3 - Interactive Form
******************************************/
$(function() {
    /*
        Intial setup for form
    */
    //set Activities Total Cost 
    let totalCost = 0;

    //get payment section div's for various payment options
    const creditCardDiv = $("div#credit-card");
    const paypalDiv = $("div#credit-card").next();
    const bitcoinDiv = paypalDiv.next();

    //set focus on first input field
    $("input:text:first").focus();
    //Job Title dropdown: hide Other textbox 
    $("#other-title").addClass('is-hidden');
     //T-shirt Info section: hide colors dropdown 
    $("div#colors-js-puns").hide(); 
    //Remove 'Select Payment' option in payment dropdown.
    $("select#payment option:eq(0)").remove();
    //Select Credit Card as default option
    $("select#payment option[value='credit card']").prop('selected', true); 

    //show appropriate Payment option DIV for selected payment option
    function adjustPaymentDiv (hiddenDiv1, hiddenDiv2, showDiv) {
        $(showDiv).removeClass('is-hidden');
        $(hiddenDiv1).addClass('is-hidden');
        $(hiddenDiv2).addClass('is-hidden');
    }
    adjustPaymentDiv(paypalDiv, bitcoinDiv, creditCardDiv);

    /*
        Global Functions Section
    */
    //VALIDATION FUNCTIONS
    //Given an element, this function will create an error <div> with a message
    //and append the message to the appropriate form location
    function createErrorMessage(errorElement) {
        let whichError;
        const isCCNumber = ((errorElement.id) && (errorElement.id === 'cc-num'));
        const isZip = ((errorElement.id) && (errorElement.id === 'zip'));
        const isCVV = ((errorElement.id) && (errorElement.id === 'cvv'));
        const messages = {
            name: "You must enter your name to register",
            mail: "Please enter a valid email address",
            activity: "Please register for at least one activity",
            ccnum: "Please enter 13 to 16 numbers for your credit card",
            zip: "Please enter exactly 5 numbers for your zip code",
            cvv: "Please enter exactly 3 numbers for your CVV",
            empty: "Please be sure to enter valid credit card information"
        };

        //determine correct message based on form id or class
        if (errorElement.id) {
            whichError = (isCCNumber) ? messages.ccnum : messages[errorElement.id];
        } else {
            whichError = messages.activity;
        }
        
        //if any payment field is empty, display the 'empty' message for payment error
        if (isCCNumber && $('#cc-num').val().trim().length == 0) { whichError = messages.empty; }
        if (isZip && $('#zip').val().trim().length == 0) { whichError = messages.empty; }
        if (isCVV & $('#cvv').val().trim().length == 0) { whichError = messages.empty; }

        //create 'div' html with correct message and append to appropriate field or form location
        const errorHTML = `<div class="error">${whichError}</div>`;
        if (errorElement.id) {
            errorElement = (isCCNumber || isZip || isCVV) ? 
                $("fieldset:last legend") 
                : errorElement; 
            $(errorHTML).hide().insertAfter(errorElement).fadeIn(2000);
        } else {
            $(errorElement).prepend(errorHTML);
        }
    }

    //Takes a field value and name and validates based on a regex test
    function validateField(fieldValue, fieldName) {
        let testField;
        let paymentField = (fieldName === 'cc-num' 
                            || fieldName === 'zip'
                            || fieldName === 'cvv');
        

        if (fieldName === 'cc-num') {fieldName = 'ccnum'};
        regexTests = {
            name: /[A-Za-z]{2}/g,
            mail: /[^@]+@[^@]+\.[a-z]+$/,
            ccnum: /^\d{13,16}$/,
            zip: /^\d{5}$/,
            cvv: /^\d{3}$/
        };

        if (fieldName === 'name') {
            //for name, remove any non-alphabetic characters
            testField = fieldValue.replace(/[^A-Za-z]/g, "");
        } else if (fieldName === 'ccnum') {
            //creditcard, remove any spaces or dashes user inputs
            testField = fieldValue.replace(/[\s-]/g, ""); 
        } else {
            testField = fieldValue.trim();
        }
        return (testField) ?  regexTests[fieldName].test(testField) : false;
    }

    //This function calls the two functions above and is the main function to process
    //validation.  It checks if validation passes, if a message already exists, if message
    //needs to be removed.
    //  
    //Note: payment fields need to be processed differently because
    //because of error message location.
    function processValidation(checkElement) {
        let fieldValidated = true;
        let hasErrorMessage;
        //payment fields are processed differently, since their error message 
        //goes in same location on form
        let isPaymentField = ((checkElement.id === "cc-num")
                            || (checkElement.id === "zip")
                            || (checkElement.id === "cvv"));

        hasErrorMessage = $(checkElement).next().hasClass("error");
        //does error message already exist for payment field
        if (isPaymentField) {
            hasErrorMessage = $("fieldset:last legend").next().hasClass("error");
        }

        //validation passes, error message created, form field gets focus
        if (!validateField(checkElement.value, checkElement.id)) {
            $(checkElement).addClass('errorInput');
            if (!hasErrorMessage) {
                createErrorMessage(checkElement);
            }
            $(checkElement).focus();
            fieldValidated = false;
        } else {
            //validation passes, remove error message, if exists
            $(checkElement).removeClass('errorInput');
            if (hasErrorMessage) {
                if (isPaymentField) {
                    $("fieldset:last legend").next().fadeOut(700, function() {
                        $(this).remove();
                    });
                } else {
                    $(checkElement).next().fadeOut(700, function() {
                        $(this).remove();
                    });
                }
            }
            fieldValidated = true;
        }
        return fieldValidated;
    }

    //Validation for 'Register for Activities' section - if no activity is checked.
    function errorNoActivity() {
        $activitiesLocation = $("fieldset.activities");
        if (!($activitiesLocation.children(":eq(0)").hasClass("error"))) {
            createErrorMessage($activitiesLocation[0]);
        }
        $('html, body').animate({
            scrollTop: $activitiesLocation.offset().top
        }, 700);
        //validation has failed.
        return false;
    }

    /*
        VALIDATION FIELD EVENT HANDLERS
    */
    $("#name").on('focusout', function(e) {
        processValidation(e.target);
    });

    $("#mail").on('keyup focusout', function(e) {
        processValidation(e.target);
    });;

    $("#cc-num").on('keyup focusout', function(e) {
        if (!($("p.totalCost").length)) {
            errorNoActivity();
        } else {
            if ($("select#payment option:selected").val() === 'credit card') {
                processValidation(e.target); 
            }
        }
    });

    $("#zip").on('keyup focusout', function(e) {
        if ($("select#payment option:selected").val() === 'credit card') {
            processValidation(e.target); 
        }
    });

    $("#cvv").on('keyup focusout', function(e) {
        if ($("select#payment option:selected").val() === 'credit card') {
            processValidation(e.target); 
        }
    });

    $("#title").on('change', function(e) {
        if ($(this).children("option:selected").val() === 'other') {
            $("#other-title").removeClass('is-hidden');
        } else {
            $("#other-title").addClass('is-hidden');
        }
    });

    /*
        FIELDSET EVENTS - display adjustments and cost calculations
    */
    //T-Shirt Info section - if T-hsirt theme is chosen, display dropdown with
    //appropriate colors.
    $("fieldset.shirt").on('change', function (e) {
        if (e.target.id === 'design') {
            //Show appropriate colors based on theme chosen
            function adjustColors ($showColors, $hideColors) {
                $($showColors).removeClass('is-hidden');
                $($hideColors).addClass('is-hidden');
                $($showColors[0]).prop('selected', true);
            }

            const $punsColors = $('#color').children(":lt(3)");
            const $heartsColors = $('#color').children(":gt(2)");
            const $optionSelected = $(e.target).children("option:selected").val();

            //show colors dropdown section if Theme is selected
            if ($(e.target)[0].selectedIndex > 0) {
                $(e.target).parent().next().show();
            } else {
                $(e.target).parent().next().hide(); 
            }
            
            //show only appropriate color options based on theme selected
            if ($optionSelected === 'js puns') {
                adjustColors($punsColors, $heartsColors);
            } else if ($optionSelected === 'heart js') {
                adjustColors($heartsColors, $punsColors);
            } 
        }
    });

    //Activities section - 
    //check an activity, disable activites that occur at same time
    //calucate cost of activities chosen
    $("fieldset.activities").on('change', function (e) {
        function getCost(text) {
            const costRegex = /^.*\$(\d+)$/i;
            return text.replace(costRegex, '$1');
        }

        function getActivityTime(text) {
            const timeRegex = /^.*((Tuesday|Wednesday)\s\d+(pm|am)-\d+(am|pm)).+$/i;
            return text.replace(timeRegex, '$1');
        }

        //const $activitiesSection = $("fieldset.activities");
        const $activitiesSection = $(e.target).parent().parent();
        //Has a property just been clicked and checked
        const clickChecked = $(e.target).prop("checked");
        //get text of activity that has been clicked
        const $activityText = $(e.target).closest('label').text();
        //get time of activity that has been clicked
        const seeTime = getActivityTime($activityText);

        //Get rid of error message if one exists
        if (clickChecked 
            && $activitiesSection.children(":eq(0)").hasClass("error")) {
                $activitiesSection.children(":eq(0)").fadeOut(1000, function() {
                    $(this).remove();
                });
        }

        //calculate and display total cost of activities that have been clicked on
        function processCost () {
            if (!$("p.totalCost").length) {
                costHTML= "<p class='totalCost'><strong>Total:</strong> $<span></span></p>"
                $activitiesSection.append(costHTML);
            }

            totalCost += ($(e.target).prop("checked") === true) ? 
                (parseInt(getCost($activityText))) :
                (parseInt(getCost($activityText)) * -1);
            
            if (totalCost === 0) {
                $("p.totalCost").remove();
            } else {
                $("p.totalCost span").text(totalCost);
            }
        }

        //This function will examine a checked or unchecked activity to see
        //if another activity exists at the same time.  If so, the conflicting activity
        //will be disabled and greyed out, as appropriate.
        function processActivities() {
            let activityChecked;
            let activityInput;
            let loopActivityTime;

            //loop though all activites.  If any conflict, disable activity (if a check) or
            //enable activity (if an uncheck)
            $activitiesSection.find('label').each(function(index, activityLabel) {
                activityInput = $(activityLabel).find('input');
                loopActivityTime = getActivityTime($(activityLabel).text());
                if (loopActivityTime == seeTime) {
                    activityChecked = ($(activityInput).prop("checked") === true)
                    //if click is to uncheck, enable conflicting activity
                    if (!clickChecked) {
                        $(activityInput).attr("disabled", false);
                        $(activityLabel).removeClass("gray-out");
                    //if click is to check, disable conflicting activity
                    } else if (!activityChecked) {
                        $(activityInput).attr("disabled", true);
                        $(activityLabel).addClass("gray-out");
                    }
                }
            });
        }
        processCost();
        processActivities();
    });

    //Payment Section - 
    //Display appropriate section for a activity selected in Payment dropdown
    $("fieldset").last().on('change', function (e) {
        if (e.target.id === 'payment') {
            //if no activity has been selected in the Activities section,
            //scroll up to Activies Section error message
            if (!($("p.totalCost").length)) {
                errorNoActivity()
            }

            const optionSelected = $("select#payment option:selected").val();
            //Remove an error message if one exists.
            if ($(e.target).prev().prev().hasClass("error")) {
                $(e.target).prev().prev().remove();       
            }

            //show appropriate Div based on Payment option selected.
            switch (optionSelected) { 
                case 'credit card': 
                    adjustPaymentDiv (paypalDiv, bitcoinDiv, creditCardDiv);
                    break;
                case 'paypal':
                     $('fieldset:last input[type="text"]').each(function(i, element) {
                         $(element).val('');
                     });
                    adjustPaymentDiv (creditCardDiv, bitcoinDiv, paypalDiv);
                    break;
                case 'bitcoin':
                    $('fieldset:last input[type="text"]').each(function(i, element) {
                        $(element).val('');
                    });
                    adjustPaymentDiv (creditCardDiv, paypalDiv, bitcoinDiv);
                    break;
                default:
                    adjustPaymentDiv (paypalDiv, bitcoinDiv, creditCardDiv);
                    break;
            }
       }
    });

    /*
        Form Submission Section
    */
    //Validate fields, don't allow submission if any fields don't validate */
    $("form").submit(function(e) {
        let allowFormSubmit = true;
        e.preventDefault();
        //validate name and email fields.     
        allowFormSubmit = processValidation($('#name')[0]);
        if (allowFormSubmit) {
            allowFormSubmit = processValidation($('#mail')[0]);
        }

        //ensure Activity has been selected
        if (allowFormSubmit) {
            if (!($("p.totalCost").length)) {
                allowFormSubmit = errorNoActivity();
            }
        }

        //check three credit card fields if credit card option selected
        //[Note: I had to call the validate fields function because the
        // validation message was placed in the same place for all three payment fields.]
        if (allowFormSubmit) {
            if ($("select#payment option:selected").val() === 'credit card') {
                if (!(validateField($('#cc-num').val(), 'cc-num'))) {
                    allowFormSubmit = processValidation($("#cc-num")[0]);
                } else if (!(validateField($('#zip').val(), 'zip'))) {
                    allowFormSubmit =  processValidation($("#zip")[0]);
                } else {
                    allowFormSubmit = processValidation($("#cvv")[0]);
                }
            }
        }

        //Message if all fields validate.
        if (allowFormSubmit) {
            if (!$(".success").length) {
                successHTML = `<div class="success">All form fields are validated. The form has been submitted!</div>`;
                $(successHTML).hide().insertAfter("header").fadeIn(2000);
            }
            $('html, body').animate({scrollTop: '0px'}, 700);
        }
    });
});
