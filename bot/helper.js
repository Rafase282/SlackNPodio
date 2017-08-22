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
          switch(typeof value.value) {
            case "object":
              if ( stringSanitizing(value.value.text).includes(stringSanitizing(filtersObject[field.external_id])) ) {
                valuesMatchesCount++;
              }
              break;
            case "string":
            default:
              if ( stringSanitizing(value.value).includes(stringSanitizing(filtersObject[field.external_id])) ) {
                valuesMatchesCount++;
              }
              break;
          }
        });
      } else {
        // Do nothing
      }
    });

    let isFilterCorrect = ( valuesMatchesCount === Object.getOwnPropertyNames(filtersObject).length );
    return isFilterCorrect;
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

  // output += `*Item:* ${itemTitle}\n`;
  requestedFieldsArrayLower.forEach((field) => {

    let isFieldInArray = typeof fieldsObj[field] !== "undefined" ;
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
  * Receives a field and returns the field type (Array, Object, or String)
  * @param {Object} field
  * @return {String}
**/
const identifyField = exports.identifyField = (field) => {

  if (Array.isArray(field)) {
    return 'Array';
  } else if (typeof field === 'object' ) {
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
  switch(identifyField(field)) {
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
  });
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
const processStringField = exports.processStringField = (stringField) => stringField;
/**
  * Receives an object containing all the fields on an item and returns a list with all the fields and their values
  * @param {Object} fieldsObj
  * @return {String}
**/
exports.listAllFields = (fieldsObj) => {
  let output = '';
  for(var key in fieldsObj) {
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

    \`@podio [options]\`
  `;

}
/**
  * Retrieves the link for the item.
  * @param {Object} item
  * @return {String}
**/
exports.getURL = (item) => item.link;
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
    output+= `*File:* ${file.name}, *size:* ${file.size? file.size + ' kb': file.size}, *link:* ${file.link}\n`;
  });
  return output;
}
/**
  * Takes response from podio api to get items
  * and retrieves a list of items
  * @param {Object} input
  * @return {String} output
**/
exports.listItems = (input) => {
  let output = '';
  let itemsObject = input;
  let itemsCount = Object.keys(itemsObject).length;

  if (itemsCount > 0) {
    output += `I've found ${itemsCount} items matching your query\n\n`;
    itemsObject.forEach((item) => {
      output += `• *Item:* ${item.title} *Link:* ${item.link}\n`;
    });
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
