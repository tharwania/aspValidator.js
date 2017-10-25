/*
*********** USAGE *********************
 var validation = {
            showErrorSummary: true, // Will show only error summary 
            errorSummaryElement: '#popupErrorSummary', // Error summary will be shown in this element
            showIndividualError: false, // won't show error on every element'
            rules: { // validation rules 
                '#txtReportName': { 
                    name: 'Report Name', // Property name to be used in validation rules
                    required: true // will popup error when submit textbox left empty
                },
                '#txtReportTitle': {
                    name: 'Report Title',
                    required: true
                }
            }
        }

validate(validation); // pass this validation object to this function to work when validating
*/


function validate(validation) {
    var validationResult = {};

    if (validation == undefined) {
        return false;
    }
    else if (validation.rules == undefined) {
        return false;
    }
    else {
        var rules = validation.rules;
        for (var selector in rules) {
            if (rules.hasOwnProperty(selector)) {
                if (rules[selector].hasOwnProperty('required') && rules[selector]['required'] == true) {
                    var isRequiredPassed = validateRequired(selector);
                    if (!isRequiredPassed) {
                        showRequiredError(selector, rules[selector].name);
                        validationResult[selector] = {};
                        validationResult[selector].isValid = false;
                        validationResult[selector].isRequiredPassed = isRequiredPassed;
                    }
                }
            }
        }
        var isFormValid = areAllFieldsValid(validationResult);

        if (isFormValid == false) {
            showErrors(validationResult, rules, validation);
        }

        return isFormValid;
    }
}

function showErrors(validationResult, rules, validation) {
    var errorSummary = [];
    for (var field in validationResult) {
        if (validationResult[field].isValid == false) {
            if (validation.showErrorSummary == true) {
                var error = getErrors(rules[field], validationResult[field]);
                errorSummary.push(error);
            }
            if (validation.showIndividualError == true) {
                showRequiredErrorIfExist(validation[field], validationResult[field], field);
            }
        }
    }
    if (validation.showErrorSummary) {
        showErrorSummaryToElement(validation.errorSummaryElement, errorSummary);
    }
}
function showErrorSummaryToElement(errorSummaryElement, errorSummary) {
    var errors = getErrorSummaryHTML(errorSummary);

    $(errorSummaryElement).html(errors);
    $(errorSummaryElement).show();
}

function getErrorSummaryHTML(errorSummary) {
    var errorHTML = "";
    for (var i = 0; i < errorSummary.length; i++) {
        if (i > 0) {
            errorHTML += "<br />";
        }
        errorHTML += errorSummary[i];
    }
    return errorHTML;
}

function showRequiredErrorIfExist(individualValidation, individualValidationResult, field) {

    if (!individualValidationResult.isRequiredPassed) {
        showRequiredError(field, propertyName);
    }
}
function getErrors(individualValidation, individualValidationResult) {
    var error = "";
    if (!individualValidationResult.isRequiredPassed) {
        error += individualValidation.name + " is required.";
    }
    return error;
}
function areAllFieldsValid(validationResult) {
    for (var field in validationResult) {
        if (validationResult[field].isValid == false) {
            return false;
        }
    }
    return true;
}
function validateRequired(selector) {
    if (selector == undefined || selector == '') {
        return false;
    }
    else {
        var value = $(selector).val();
        if (value == '' || value == undefined) {
            return false;
        }
        else {
            return true;
        }
    }
}

function showRequiredError(selector, propertyName) {
    $(selector).css('border-color', 'red');
    $(selector).on('change', function () {
        $(selector).css('border-color', '');
    });
}