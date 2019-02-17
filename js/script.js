$(function() {
    $("form").submit(function(e){
        e.preventDefault();
        processValidation($('#name')[0]);
        processValidation($('#mail')[0]);
        if (!($("p.totalCost").length)) {
            errorNoActivity();
        } else {
            if ($("select#payment option:selected").val() === 'credit card') { 
                if (!(validateField($('#cc-num').val(), 'cc-num'))) {
                    processValidation($("#cc-num")[0]);
                } else if (!(validateField($('#zip').val(), 'zip'))) {
                    processValidation($("#zip")[0]);
                } else {
                    processValidation($("#cvv")[0]);
                }
            }
        }
    });

    //set focus on first input field
    $("input:text:first").focus();
    $("#color").prop("disabled", true);
    totalCost = 0;
    //hide other-title text field until 'Other' is selected in Job Role dropdown menu 
    $("#other-title").addClass('is-hidden');

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

        if (errorElement.id) {
            whichError = (isCCNumber) ? messages.ccnum : messages[errorElement.id];
        } else {
            whichError = messages.activity;
        }
        
        if (isCCNumber || isZip || isCVV) {
            if (($('#cc-num').val().trim().length == 0) ||
                ($('#zip').val().trim().length == 0)    ||
                ($('#cvv').val().trim().length == 0)) 
            {
                whichError = messages.empty;
            }
        }

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

    function processValidation(checkElement) {
        let hasErrorMessage;
        let isPaymentField = ((checkElement.id === "cc-num")
                            || (checkElement.id === "zip")
                            || (checkElement.id === "cvv"));

        hasErrorMessage = $(checkElement).next().hasClass("error");
        if (isPaymentField) {
            hasErrorMessage = $("fieldset:last legend").next().hasClass("error");
        }

        if (!validateField(checkElement.value, checkElement.id)) {
            $(checkElement).addClass('errorInput');
            if (!hasErrorMessage) {
                createErrorMessage(checkElement);
            }
            $(checkElement).focus();
        } else {
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
        }
    }

    function errorNoActivity() {
        $activitiesLocation = $("fieldset.activities");
        if (!($activitiesLocation.children(":eq(0)").hasClass("error"))) {
            createErrorMessage($activitiesLocation[0]);
        }
        $('html, body').animate({
            scrollTop: $activitiesLocation.offset().top
        }, 700);
    }

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
            processValidation(e.target); 
        }
    });

    $("#zip").on('keyup focusout', function(e) {
            processValidation(e.target);
    });

    $("#cvv").on('keyup focusout', function(e) {
        processValidation(e.target);
});


    $("#title").on('change', function(e) {
        if ($(this).children("option:selected").val() === 'other') {
            $("#other-title").removeClass('is-hidden');
        } else {
            $("#other-title").addClass('is-hidden');
        }
    });

    $("fieldset.shirt").on('change', function (e) {
        if (e.target.id === 'design') {
            const $punsColors = $('#color').children(":lt(3)");
            const $heartsColors = $('#color').children(":gt(2)");

            function adjustColors ($showColors, $hideColors) {
                $($showColors).removeClass('is-hidden');
                $($hideColors).addClass('is-hidden');
                $($showColors[0]).prop('selected', true);
            }

            if  ($(e.target.children[0]).val() === 'Select Theme') {
                $(e.target.children[0]).remove();
            } 
            const $optionSelected = $(e.target).children("option:selected").val();

            $("#color").prop("disabled", false);
            if ($optionSelected === 'js puns') {
                adjustColors($punsColors, $heartsColors);
            } else if ($optionSelected === 'heart js') {
                adjustColors($heartsColors, $punsColors);
            } 
        }
    });

    $("fieldset.activities").on('change', function (e) {
        //Has a property just been clicked and checked
        const clickChecked = $(e.target).prop("checked");

        //Get rid of error message if one exists
        const $activitiesSection = $("fieldset.activities"); 
        if (clickChecked 
            && $activitiesSection.children(":eq(0)").hasClass("error")) {
                $activitiesSection.children(":eq(0)").fadeOut(1000, function() {
                    $(this).remove();
                });
        }
        //calculate cost
        function getCost(text) {
            const costRegex = /^.*\$(\d+)$/i;
            return text.replace(costRegex, '$1');
        }

        function getActivityTime(text) {
            const timeRegex = /^.*((Tuesday|Wednesday)\s\d+(pm|am)-\d+(am|pm)).+$/i;
            return text.replace(timeRegex, '$1');
        }

        $activityText = $(e.target).closest('label').text();

        //cost code
        if (!$("p.totalCost").length) {
            costHTML= "<p class='totalCost'><strong>Total:</strong> $<span></span></p>"
            $(this).append(costHTML);
        }

        totalCost += ($(e.target).prop("checked") === true) ? 
            (parseInt(getCost($activityText))) :
            (parseInt(getCost($activityText)) * -1);
        
        if (totalCost === 0) {
            $("p.totalCost").remove();
        } else {
            $("p.totalCost span").text(totalCost);
        }

        //time code
        const seeTime = getActivityTime($activityText);
        
        let activityChecked;
        let activityInput;
        let loopActivityTime;

        $("fieldset.activities").find('label').each(function(index, activityLabel) {
            activityInput = $(activityLabel).find('input');
            loopActivityTime = getActivityTime($(activityLabel).text());
            if (loopActivityTime == seeTime) {
                activityChecked = ($(activityInput).prop("checked") === true)
                if (!clickChecked) {
                    $(activityInput).attr("disabled", false);
                    $(activityLabel).removeClass("gray-out");
                } else if (!activityChecked) {
                    $(activityInput).attr("disabled", true);
                    $(activityLabel).addClass("gray-out");
                }
            }
        });
    });


    const creditCardDiv = $("div#credit-card");
    const paypalDiv = $("div#credit-card").next();
    const bitcoinDiv = paypalDiv.next();

    function adjustPaymentDiv (hiddenDiv1, hiddenDiv2, showDiv) {
        $(showDiv).removeClass('is-hidden');
        $(hiddenDiv1).addClass('is-hidden');
        $(hiddenDiv2).addClass('is-hidden');
    }

    $("select#payment option:eq(0)").remove();
    $("select#payment option[value='credit card']").prop('selected', true);

    adjustPaymentDiv(paypalDiv, bitcoinDiv, creditCardDiv);


    $("fieldset").last().on('change', function (e) {
        if (e.target.id === 'payment') {
            if (!($("p.totalCost").length)) {
                errorNoActivity()
            }

            const optionSelected = $("select#payment option:selected").val();

            switch (optionSelected) { 
                case 'credit card': 
                    adjustPaymentDiv (paypalDiv, bitcoinDiv, creditCardDiv);
                    break;
                case 'paypal':
                    // 
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
});
