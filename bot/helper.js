'use strict';

/* exported filterFields listFields */

/**
 * Filters an array of "fields" by label or text value
 * @param {Array} fields
 * @param {String} name
 * @return {Object}
 **/
const filterFields = exports.filterFields = (fields, name) => {
        return fields.filter((field) => field.label === name || field.text === name)[0];
    }
/**
 * Receives a String with filter formated like this: "filter1=value1,filter2=value2..." and returns an object
 * @param {String} filters
 * @return {Object}
 **/
const getFiltersObject = exports.getFiltersObject = (fields) => {
        const fieldsArray = fields.split(",");
        let fieldsObj = {};

        fieldsArray.forEach((element) => {
            let tempArray = element.split("=");
            fieldsObj[tempArray[0]] = tempArray[1];
        });

        return fieldsObj;
    }
/**
 * Receives an array of items and a list of filters and returns the list of items filtered according to the filters provided
 * @param {String} filters
 * @param {Array} items
 * @return {Array}
 **/
exports.filterItems = (filters, items) => {
        let processedItems = [];
        let filtersObject = getFiltersObject(filters);

        processedItems = items.filter((item) => {
            let valuesMatchesCount = 0;
            item.fields.forEach((field) => {
                //check if the current property is one of the specified ones in the filters list
                if (filtersObject.hasOwnProperty(field.external_id)) {
                    //Now let's see if the value matches the one in the filtersObject
                    field.values.forEach((value) => {
                        //value could be an object or a string
                        let type = typeof value.value;
                        if (type === "object" && stringSanitizing(value.value.text).includes(stringSanitizing(filtersObject[field.external_id]))) {
                            valuesMatchesCount++;
                        } else if (type === "string" && stringSanitizing(value.value).includes(stringSanitizing(filtersObject[field.external_id]))) {
                            valuesMatchesCount++;
                        }
                    });
                }
            });
            return (valuesMatchesCount === Object.getOwnPropertyNames(filtersObject).length);
        });
        return processedItems;
    }
/**
 * Receives an object containing all the fields on an item and returns a list with the requested fields
 * @param {Object} fieldsObj
 * @param {String} requestedFields
 * @return {String}
 **/
exports.listFields = (fieldsObj, requestedFields) => {
        const requestedFieldsArray = requestedFields.split(',');
        let output = '';

        // Make all requested fields lowercase to make sure they match the field names in Podio
        let requestedFieldsArrayLower = requestedFieldsArray.map(stringSanitizing);
        requestedFieldsArrayLower.forEach((field) => {

            let isFieldInArray = typeof fieldsObj[field] !== "undefined";
            output += `• *${capitalizeFirstLetter(field)}:* `;

            if (isFieldInArray) {
                output += `${fieldsObj[field].text}\n`;
            } else {
                output += `n/a\n`;
            }
        });

        return output;
    }

/**
 * parse HTML 
 * @param {String}
 * @return {String}
 **/
const parseHTML = exports.parseHTML = (str) => {
        str = str.toString();
        str = str.replace(/<.*?>/g,' '); //remove any text between and including <>
        str = str.replace(/&nbsp;/g, ' '); //remove nonbreaking space text
        return str;
    }
/**
 * Receives a field and returns the field type (Array, Object, or String)
 * @param {Object} field
 * @return {String}
 **/
const identifyField = exports.identifyField = (field) => {

        if (Array.isArray(field)) {
            return 'Array';
        } else if (typeof field === 'object') {
            return 'Object';
        } else {
            return 'String';
        }
    }
/**
 * Receives a field and returns the info in this field as a string depending on the field type (Array, Object, or String)
 * @param {Object} field
 * @return {String}
 **/
const processField = exports.processField = (field) => {
        let output = '';
        switch (identifyField(field)) {
            case 'Array':
                output = processArrayField(field);
                break;
            case 'Object':
                output = processObjectField(field);
                break;
            case 'String':
                output = processStringField(field);
                break;
        }
        return output;
    }
/**
 * Receives a field of type array and returns the info in this field as a string
 * @param {Array} arrayField
 * @return {String}
 **/
const processArrayField = exports.processArrayField = (arrayField) => {
        let output = '';
        arrayField.forEach((element) => {
            output += processObjectField(element);
            output += " | ";
        });
        output = output.slice(0,-3);
        return output;
    }
/**
 * Receives a field of type object and returns the info in this field as a string
 * @param {Object} objectField
 * @return {String}
 **/
const processObjectField = exports.processObjectField = (objectField) => {
        let output = '';
        if (objectField.hasOwnProperty('text')) {
            output += processStringField(objectField.text);
        } else if (objectField.hasOwnProperty('start_date')) {
            output += processStringField(objectField.start_date);
        } else if (objectField.hasOwnProperty('name')) {
            output += `${processStringField(objectField.name)} - ${processStringField(objectField.mail)}`;
        } else {
            output += 'n/a';
        }
        return output;
    }
/**
 * Receives a field of type string and returns the info in this field as a string
 * @param {String} stringField
 * @return {String}
 **/
const processStringField = exports.processStringField = (stringField) => {
    console.log('string is: ' + stringField);
    console.log('string to string is: ' +stringField.toString());
    if(stringField == ''){
        console.log('*****returning N/A**********');
        return 'N/A';
    }else{
        return parseHTML(stringField);        
    }
}
/**
 * Receives an object containing all the fields on an item and returns a list with all the fields and their values
 * @param {Object} fieldsObj
 * @return {String}
 **/
exports.listAllFields = (fieldsObj) => {
        let output = '';
        fieldsObj = renameKeys(fieldsObj);//must rename before sort
        fieldsObj = objSort(fieldsObj);
        for (var key in fieldsObj) {
            if (fieldIsNotHidden(key)) {
                output += `• *${capitalizeFirstLetter(key)}:* ${processField(fieldsObj[key])}\n`;
            }
        }
        return output;
    }
/**
 * Retrieves the ID for an Item object.
 * @param {Object} item
 * @return {Number}
 **/
exports.getItemID = (item) => item.item_id;
/**
 * Retrieves the field ID for an item by field name.
 * @param {Object} item
 * @param {String} name
 * @return {Number}
 **/
exports.getFieldID = (item, name) => {
        return filterFields(item.fields, name).field_id;
    }
/**
 * Retrieves the ID for a field value.
 * @param {Array} options
 * @param {String} name
 * @return {Number}
 **/
exports.getFieldValueID = (options, value) => {
        return filterFields(options, value).id;
    }
/**
 * Provides useful information for the user.
 * @return {String}
 **/
exports.showHelp = () => {
    return `*SlacknPodio Usage:*

  Allows team members to interact with data from Podio by using commands within a Slack channel.
  Any team member can easily retrieve information, or make updates without ever opening a browser.
  Even team members without a Podio account now have the ability to interact with Podio right from within a Slack channel.

  *Synopsis*

    \`command [options]\`

*Commands*

  \`search <keyword>\` will search all tests and return Title - URL which include keyword
  \`show <unique keyword>\` will show details for a test (must be specific to one test)
  \`queue\` will show all tests currently in sprint
  \`live\` will show all tests currently live
  \`assigned <vertical>\` will show all latest tests assigned to team member
        accepts: Brett|Minh|Tony|Acquisition|Lifecycle
  `;

}
/**
 * Validates the type of response and returns the right value.
 * @param {Object} value
 * @return {Number || String}
 **/
exports.checkValue = (value) => {
    return parseInt(value, 10) || value.text || (typeof value === 'object' ?
        stringVal(value) :
        value);
};
/**
 * Takes response from podio api to get files
 * and retrieves the important data
 * @param {String} input
 * @return {String} output
 **/
exports.listFiles = (input) => {
        let output = '';
        input.forEach((file) => {
            output += `*File:* ${file.name}, *size:* ${file.size? file.size + ' kb': file.size}, *link:* ${file.link}\n`;
        });
        return output;
    }
/**
 * Takes response from podio api to get items
 * and retrieves a list of items
 * @param {Object} input
 * @return {String} output
 **/
exports.listItems = (input, showVert = true) => {
        let output = '';
        let itemsObject = input;
        let itemsCount = Object.keys(itemsObject).length;
         
        if (itemsCount > 0) {
            output += `I've found ${itemsCount} items matching your query\n\n`;
            
            if(showVert){
                output += verticalOrdered(itemsObject);
            }else{
                itemsObject.forEach((item) => {
                    output += `• *Item:* ${item.title} | *Link:* ${item.link}\n`;
                });
            }
           
        } else {
            output = `*No items were found*`;
        }

        return output;
    }
/**
 * Converts a string to a boolean
 * source: http://stackoverflow.com/questions/263965
 * @param {String} input
 * @return {Boolean}
 **/
exports.isTrue = (input) => {
        if (typeof(input) === 'string') {
            input = stringSanitizing(input);
        }
        switch (input) {
            case true:
            case "true":
            case 1:
            case "1":
            case "on":
            case "yes":
                return true;
            default:
                return false;
        }
    }
/**
 * Capitalizes the first letter in a string
 * source: https://stackoverflow.com/questions/1026069
 * @param {String} input
 * @return {String}
 **/
const capitalizeFirstLetter = exports.capitalizeFirstLetter = (input) => {
        return input.charAt(0).toUpperCase() + input.slice(1);
    }
/**
 * Returns the all lower case version of a string
 * @param {String} input
 * @return {String}
 **/
const toLower = exports.toLower = (input) => {
        return input.toLowerCase();
    }
/**
 * Returns the string representation of a given object
 * @param {Object} input
 * @return {String}
 **/
const stringVal = exports.stringVal = (input) => {
        return JSON.stringify(input);
    }
/**
 * Returns a boolean whether or not the field should be returned on the podio requests
 * @param {Object} input
 * @return {String}
 **/
const fieldIsNotHidden = exports.fieldIsNotHidden = (fieldName) => {
        return !(process.env.ignoreFields.indexOf(fieldName) > -1);
    }
/**
 * Takes user input and returns sanitized
 * @param {Object} input
 * @return {String}
 **/
const stringSanitizing = exports.stringSanitizing = (input) => {
    let sanitizedString = toLower(input.trim());
    return sanitizedString;
}
/**
 * rename podio object keys to custom values 
 * @param {Object} input
 * @return {Object}
 **/
const renameKeys = exports.renameKeys = (obj) => {
    var customFieldNames = {
        'customer-type' : 'Customer Type',
        'category' : 'Site Section',
        'category-3' : 'Stakeholder',
        'status-2' : 'status',
        'category-2' : 'Current Step',
        'vertical-2' : 'Vertical',
        'creative-url' : 'Creative URL(s)',
        'notes-3' : 'Notes',
        'assigned-to' : 'Assigned-to',
        'offercontent-flag' : 'Offers And/Or Content',
        'vertical':'KPI',
        'qa-links': 'QA Links'};

    for (var key in obj) {
        if (key in customFieldNames) {
            Object.defineProperty(obj, customFieldNames[key],
                Object.getOwnPropertyDescriptor(obj, key));
            delete obj[key];
        }
    }
    return obj;
}
/**
 * custom sort object - use renamed keys from above renameKeys function
 * @param {Object} input
 * @return {Object}
 **/
const objSort = exports.objSort = (obj) => {
    //custom order
    var orderedObj = {
        'title':'',
        'Vertical':'',
        'division':'',
        'status':'',
        'launch-date':'',
        'Current Step':'',
        'KPI':'',
        'platform':'',
        'Customer Type':'',
        'Creative URL(s)':'',
        'QA Links':'',
        'loe':'',
        'Offers And/Or Content':'',
        'Notes':'',
        'blockers':'',
        'Assigned-to':''};

    for (var key in obj) {
            orderedObj[key] = obj[key];
    }
    return orderedObj;
}
/**
 * custom order of items by vertical name
 * @param {Object} input
 * @return {string} 
 **/
const verticalOrdered = exports.verticalOrdered = (obj) => {
    var itemoutput = '';
    var orderedObj = {};

    obj.forEach((item) => {
        var vertical = `${item.fields[1].values[0].value.text}`;
        if(vertical in orderedObj){
                orderedObj[vertical].push(`• *Item:* ${item.title} | *Link:* ${item.link}`);
            }else{
                orderedObj[vertical] = [`• *Item:* ${item.title} | *Link:* ${item.link}`];
            }
        });

    Object.keys(orderedObj).forEach(function(i){ 
        itemoutput += '\n*Vertical: ' + i + '*\n' ;
        orderedObj[i].forEach(function(j){
            itemoutput += j + '\n' ;
        });
    })
    return itemoutput;
}