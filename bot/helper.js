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
 * Takes a message as input and breaks it down into multiple parts
 * to get actions and data.
 * @param {String} input
 * @return {Object}
 **/
const handleInput = exports.handleInput = (input) => {
  const msg = input.split(' ');
  return {
    keyword: msg[0],
    item: msg[1],
    cmd: msg[2] || msg[1],
    field: msg[3],
    value: msg[4],
    all: [...msg]
  };
};
