'use strict';

// Function to filter array of fields by label or text
const filterFields = exports.filterFields = (fields, key) => {
  return fields.filter((field) => field.label === key || field.text === key)[0];
}
// Gets item's ID
const getItemID = exports.getItemID = (items_arr) => items_arr.item_id;
// Gets field id
const getFieldID = exports.getFieldID = (items_arr, field_name) => {
  return filterFields(items_arr.fields, field_name).field_id;
}
// Gets field's value id
const getFieldValueID = exports.getFieldValueID = (options_arr, field_value) => {
  return filterFields(options_arr, field_value).id;
}
// Show Help
const showHelp = exports.showHelp = () => {
  const help = `Show help message.`;
  return help;
}
// Retrieves URL
const getURL = exports.getURL = (itemObj) => itemObj.link;
