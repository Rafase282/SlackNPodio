'use strict';

const Podio = require('podio-js').api;
const helper = require('./helper');
const bot = require('./bot');
require('dotenv').config({silent: true});
const podio = new Podio({
  authType: 'app', // or client
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret
});
const app = {helper, bot};
const podioAuthenticated = exports.podioAuthenticated = false;

 /**
  * Podio API call to filter items by exact titles.
  *
  * Note: Also providing a "property" for the filter would allows us to filter
  * by anything other than the title. Something useful for the new get/list.
  * However, this API calls required an exact match although it is not case sensitive.
  * I would say it is only good for getting specific things, not really useful for lists.
  * @param {String} name
  * @return {Object}
 **/
const getPodioItem = exports.getPodioItem = (name) => {
  const data = {
    'sort_by': 'title',
    'sort_desc': true,
    'filters': {
      title: name
    },
    'limit': 30,
    'offset': 0,
    'remember': false
  }
  // Returns Filtered Item Object
  return podio.request('POST', '/item/app/17912486/filter/', data).then((res) => res.items[0]);
}

/**
 * Provides message with the item's link.
 * Users must provide the item name. It depends on getPodioItem to find the right item.
 * Usage: @podio {name} url
 * @param {String} name
 * @return {String}
 **/
const getURL = exports.getURL = (name) => getPodioItem(name).then((item) =>
  `Item: ${name}, Item Link: ${app.helper.getURL(item)}`);
/**
 * Retrieves field's value when you know the item's exact title, it depends on
 * getPodioItem to find the right item.
 * Usage: @podio {item} get {name}
 * @param {Object} item
 * @param {String} name
 * @return {String}
 **/
const getValue = exports.getValue = (item, name) => {
  return getPodioItem(item).then((item) => {
    let res = app.helper.filterFields(item.fields, name);
    if (typeof res !== 'undefined') {
      //Returns either a number, string, or whole value.
      res = app.helper.checkValue(res.values[0].value);
    }
      return `Item: ${item.title}, Field: ${name}, Value: ${res}`;
  });
}
/**
 * Writes a new field's value when you know the item's exact title, it depends on
 * getPodioItem to find the right item.
 * Usage: @podio {item} set {name} {value}
 * @param {String} item
 * @param {String} name
 * @param {String} value
 * @return {String}
 **/
const setValue = exports.setValue = (item, name, value) => {
  return getPodioItem(item).then((item) => {
    const options = item.fields[1].config.settings.options;
    const item_id = app.helper.getItemID(item);
    let fieldID = value;
    let data = {};
    if (name === 'Category' || name === 'category') {
      fieldID = app.helper.getFieldValueID(options, value);
      data = {
        'category': [fieldID]
      };
    }
    data[name.toLowerCase()] = fieldID;
    return podio.request('PUT', `/item/${item_id}/value/`, data).then((res) => {
      return `Item: ${item.title}, Field: ${name}, Value set to: ${value}`;
    });
  });
}
/**
 * Authenticates the bot with the podio api.
 * @param {Function} callback
 * @param {Function} errorCallback
 * @return {Boolean}
 **/
const authenticatePodio = exports.authenticatePodio = (callback, errorCallback) => {
  return podio.authenticateWithApp(process.env.appID, process.env.appToken, (err) => {
    errorCallback(err);
    return podio.isAuthenticated().then(() => {
      callback();
    }).catch((err) => {
      errorCallback(err);
    });
  });
}
