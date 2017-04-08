'use strict';

// Function to filter array of fields by label or text
const filterFields = exports.filterFields = (fields, name) => {
  return fields.filter((field) => field.label === name || field.text === name)[0];
}
// Gets item's ID
const getItemID = exports.getItemID = (item) => item.item_id;
// Gets field id
const getFieldID = exports.getFieldID = (item, name) => {
  return filterFields(item.fields, name).field_id;
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
// Check type of response
const checkRes = exports.checkRes = (res) => {
  return parseInt(res, 10) || res.text || (typeof res === 'object'
    ? JSON.stringify(res)
    : res);
};
