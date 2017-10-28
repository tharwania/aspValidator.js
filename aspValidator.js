/*
*********** USAGE *********************
This is change i make
 var validation = {
            showErrorSummary: true, // Will show only error summary 
            errorSummaryElement: '#popupErrorSummary', // Error summary will be shown in this element
            showIndividualError: false, // won't show error on every element'
            rules: { // validation rules 
                '#txtReportName': { 
                    name: 'Report Name', // Property name to be used in validation rules
                    required: true // will popup error when submit textbox left empty
                    requiredErrorMessage: "this is required error message", // custom required message 
                    regex: 'dsf4654sdfdd', // regex to verify
                    regexErrorMessage: 'Add emails seperated by commo', //
                    customValidation: function(){ //custom validation done here },
                    customValidationMessage: "custom validation message here."

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
                var property = rules[selector];
               
                validationResult[selector] = {};

                checkRequiredValidation(property, validationResult[selector], selector);
                checkRegexValidation(property, validationResult[selector], selector);
                checkCustomValidation(property, validationResult[selector], selector);
        }
        var isFormValid = areAllFieldsValid(validationResult);

        if (isFormValid == false) {
            showErrors(validationResult, rules, validation);
        }

        return isFormValid;
    }
}
function checkCustomValidation(property, result, selector){
    if (property.hasOwnProperty('customValidation') && property['customValidation'] != '') {
        var isCustomValidationPassed = validateCustomValidation(selector, property);
        if (!isCustomValidationPassed) {
           // showRequiredError(selector, property.name);

            result.isValid = false;
            result.isCustomValidationPassed = isCustomValidationPassed;
        }
    }
}
function checkRegexValidation(property, result, selector) {
    if (property.hasOwnProperty('regex') && property['regex'] != '') {
        var isRegexPassed = validateRegex(selector, property);
        if (!isRegexPassed) {
            showRequiredError(selector, property.name);

            result.isValid = false;
            result.isRegexPassed = isRegexPassed;
        }
    }
}

function checkRequiredValidation(property, result, selector) {
    if (property.hasOwnProperty('required') && property['required'] == true) {
        var isRequiredPassed = validateRequired(selector);
        if (!isRequiredPassed) {
            showRequiredError(selector, property.name);

            result.isValid = false;
            result.isRequiredPassed = isRequiredPassed;
        }
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
    if (individualValidationResult.hasOwnProperty("isRequiredPassed") && !individualValidationResult.isRequiredPassed) {
        if (individualValidation.hasOwnProperty("requiredErrorMessage")) {
            error += individualValidation.requiredErrorMessage;
        }
        else {
            error += individualValidation.name + " is required.";
        }
    }
    if (individualValidationResult.hasOwnProperty("isRegexPassed") && !individualValidationResult.isRegexPassed && error == "") { // if required has error don't show regex errors'
        if (individualValidation.hasOwnProperty("regexErrorMessage")) {
            error += individualValidation.regexErrorMessage;
        }
        else {
            error += individualValidation.name + "is invalid.";
        }
    }
    if (individualValidationResult.hasOwnProperty("isCustomValidationPassed") && !individualValidationResult.isCustomValidationPassed && error == "") {
        if (individualValidation.hasOwnProperty("customValidationMessage")) {
            error += individualValidation.customValidationMessage;
        }
        else {
            error += individualValidation.name + "is invalid.";
        }
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
        var value = getElementValue(selector);
        if (value == '' || value == undefined) {
            return false;
        }
        else {
            return true;
        }
    }
}

function validateRegex(selector, property) {
    if (selector == undefined || selector == '') {
        return false;
    }
    else {
       
        var value = getElementValue(selector);
        var regex;
        try {
            regex = new RegExp(property.regex);
        }
        catch (e) {
            consol.error(e);
            return false;
        }
        var regexResult = regex.test(value)
        return regexResult;
    }
}
function validateCustomValidation(selector, property) {
    return property.customValidation();
}
function getElementValue(selector) {
    var elementType = $(selector).attr('type');
    if (elementType == "checkbox") {
        return $(selector).is('checked');
    }
    else if (elementType == "text") {
        return $(selector).val();
    }
}

function showRequiredError(selector, propertyName) {
    $(selector).css('border-color', 'red');
    $(selector).on('change', function () {
        $(selector).css('border-color', '');
    });
}
