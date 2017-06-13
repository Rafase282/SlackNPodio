'use strict';

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
  * Receives an object containing all the fields on an item and returns a list with the requested fields
  * @param {Object} fieldsObj
  * @param {String} requestedFields
  * @return {String}
**/
const listFields = exports.listFields = (fieldsObj, requestedFields) => {
  const requestedFieldsArray = requestedFields.split(',');
  let output = '';

  // Make all requested fields lowercase to make sure they match the field names in Podio
  let requestedFieldsArrayLower = requestedFieldsArray.map(toLower);

  // output += `*Item:* ${itemTitle}\n`;
  requestedFieldsArrayLower.forEach((field) => {

    let isFieldInArray = fieldsObj[field] !== undefined ;
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
  * Retrieves the ID for an Item object.
  * @param {Object} item
  * @return {Number}
**/
const getItemID = exports.getItemID = (item) => item.item_id;
/**
  * Retrieves the field ID for an item by field name.
  * @param {Object} item
  * @param {String} name
  * @return {Number}
**/
const getFieldID = exports.getFieldID = (item, name) => {
  return filterFields(item.fields, name).field_id;
}
/**
  * Retrieves the ID for a field value.
  * @param {Array} options
  * @param {String} name
  * @return {Number}
**/
const getFieldValueID = exports.getFieldValueID = (options, value) => {
  return filterFields(options, value).id;
}
/**
  * Provides useful information for the user.
  * @return {String}
**/
const showHelp = exports.showHelp = () => {
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
const getURL = exports.getURL = (item) => item.link;
/**
  * Validates the type of response and returns the right value.
  * @param {Object} value
  * @return {Number || String}
**/
const checkValue = exports.checkValue = (value) => {
  return parseInt(value, 10) || value.text || (typeof value === 'object' ?
    JSON.stringify(value) :
    value);
};
/**
  * Takes response from podio api to get files
  * and retrieves the important data
  * @param {String} input
  * @return {String} output
**/
const listFiles = exports.listFiles = (input) => {
  let output = '';
  input.forEach((file) => {
    output+= `*File:* ${file.name}, *size:* ${file.size? file.size + ' kb': file.size}, *link:* ${file.link}\n`;
  });
  return output;
}
/**
  * Takes response from podio api to get items
  * and retrieves a list of items
  * @param {String} input
  * @return {String} output
**/
const listItems = exports.listItems = (input) => {
  let output = '';
  let itemsCount = input.counts.item;

  if (itemsCount > 0) {
    output += `I've found ${itemsCount} items matching your query\n\n`;
    input.results.forEach((item) => {
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
const isTrue = exports.isTrue = (input) => {
  if (typeof(input) === 'string') {
    input = input.toLowerCase().trim();
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
