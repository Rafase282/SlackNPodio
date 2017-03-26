/*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
'use strict';

/* Retrieves both podio and rtm
 * from the index route.
 * this should just hold helper functions for the bot only
 */
const bot = require('./index.js');

// Function to filter array of fields by label or text
const filterFields = exports.filterFields = function(fields, key) {
  return fields.filter((field) => field.label === key || field.text === key);
}

// Function with the podio api call to get all items and filter by excat title
const filterItems = exports.filterItems = function(item_name) {
  const data = {
    'sort_by': 'title',
    'sort_desc': true,
    'filters': {
      title: item_name
    },
    'limit': 30,
    'offset': 0,
    'remember': false
  }
  // Returns Filtered Item Object
  return bot.podio.request('POST', '/item/app/17912486/filter/', data)
    .then((res) => res.items);
}

// Gets item's ID
const getItemID = exports.getItemID = function(items_arr) {
  return items_arr[0].item_id;
}

// Gets field id
const getFieldID = exports.getFieldID = function(items_arr, field_name) {
  return filterFields(items_arr[0].fields, field_name)[0].field_id;
}

// Gets field's value id
const getFieldValueID = exports
  .getFieldValueID = function(options_arr, field_value) {
    return filterFields(options_arr, field_value)[0].id;
  }

// function to get values
const getStatus = exports.getStatus = function(item_name, field_name, channel) {
  return filterItems(item_name).then((items) => {
    let res = filterFields(items[0].fields, field_name)[0].values[0].value;
    //Returns either a number, string, or whole value.
    res = parseInt(res, 10) || res.text || res;
    bot.rtm.sendMessage(
      `Item: ${item_name}, Field: ${field_name}, Value: ${res}`,
      channel
    );
  });
}

// Sets status field to value Active or Inactive
//Action: @podio Item's Name set Field's Name Value
const setStatus = exports
  .setStatus = function(item_name, field_name, field_value, channel) {
    return filterItems(item_name).then((item) => {
      const options = item[0].fields[1].config.settings.options;
      const item_id = getItemID(item);
      let fieldID = field_value;
      let data = {};
      if (field_name === 'Category' || field_name === 'category') {
        fieldID = getFieldValueID(options, field_value);
        data = {
          'category': [fieldID]
        };
      }
      data[field_name.toLowerCase()] = fieldID;
      return podio.request('PUT', `/item/${item_id}/value/`, data)
        .then((res) => {
          bot.rtm.sendMessage(
            `Item: ${item_name}, Field: ${field_name},` +
            ` Value set to: ${field_value}`,
            channel
          );
        });
    });
  }
