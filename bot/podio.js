'use strict';

const Podio = require('podio-js').api;
const helper = require('./helper');
const bot = require('./bot');
require('dotenv').config({silent: true});
const podio = new Podio({
  authType: 'app',
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret
});
const app = {helper, bot};
const podioAuthenticated = exports.podioAuthenticated = false;
exports.WRITE = helper.isTrue(process.env.WRITE);
exports.READ = helper.isTrue(process.env.READ);

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
  console.log(JSON.stringify(data));
  // Returns Filtered Item Object
  return podio.request('POST', `/item/app/${process.env.appID}/filter/`, data)
    .then((res) => res.items[0]);
}
/**
  * Podio API call to filter Items using multiple filters
  * @param {String} filters
  * @return {Object}
**/
const getPodioItemsByFilters = exports.getPodioItemsByFilters = (filters) => {
  // console.log(app.helper.getFiltersObject(filters));
  const filter = {
    "sort_by": 'title',
    "sort_desc": true,
    "state": 'active',
    "limit": 500,
    "offset": 0,
    "remember": false
  }
  
  bot.cb('Please wait, this could take a few seconds...');
  
  return podio.request('POST', `/item/app/${process.env.appID}/filter/`, filter)
    .then((res) => {
      console.log(app.helper.getFiltersObject(filters));
     
      let filteredItems = app.helper.filterItems(filters, res.items);
      return app.helper.listItems(filteredItems);
    })
    .catch((err) => console.log(err));
}
/**
  * Returns an object with all the info related to the Podio Item identify by the ID provided
  * @param {Number} itemId
  * @return {Object}
**/
const showAllFields = exports.showAllFields = (query) => {
  return getPodioItem(query)
    .then((res) => {
      let output = `*Item:* ${res.title}\n*Link:* ${res.link}\n\n`;
      return getPodioItemValues(res.item_id).then((res) => {
        console.log(`showAllFields: ${JSON.stringify(res)}`);
        return output += app.helper.listAllFields(res);
      })
      .catch((err) => {
        console.log(err);
      });
    })
    .catch((err) => {
      console.log(`showAllFields: ${err}`);
      return `I'm sorry, I couldn't find an item by that *title*, please make sure you have the *exact* item title, put the title between quote marks and try again.`;
    });
}
/**
  * Returns an object with all the info related to the Podio Item identify by the ID provided
  * @param {Number} itemId
  * @return {Object}
**/
const getPodioItemValues = exports.getPodioItemValues = (itemId) => {
  return podio.request('GET', `/item/${itemId}/value/v2/`);
}
/**
  * Returns an object with all the items that contain the partial string specified on query with the configuration provided on the rest of the parameters
  * Usage: {name} query limit search_fields counts highlights offset ref_type
  * @param {String} query
  * @param {Number} limit
  * @param {Boolean} counts
  * @param {Boolean} highlights
  * @param {Number} offset
  * @param {String} ref_type
  * @param {String} search_fields
  * @return {Object}
**/
const getPodioItems = exports.getPodioItems = (query = 'name', limit = 50, search_fields = 'title', counts = true, highlights = false, offset = 0, ref_type = 'item') => {
  return podio.request('GET', `/search/app/${process.env.appID}/v2/?query=${query}&limit=${limit}&search_fields=${search_fields}&counts=${counts}&highlights=${highlights}&offset=${offset}&ref_type=${ref_type}`);
}
/**
  * Returns a list of all items matching the given filters and sorted by the specified attribute.
  * Usage: {name} name
  * @param {String} name
  * @return {String}
**/
const getItemsList = exports.getItemsList = (name) => {
  return getPodioItems(name, 50, 'title', true, true, 0, 'item').then((res) => app.helper.listItems(res.results));
}
/**
  * Returns a list of requested fields for the specified Item
  * Usage: {query} query fields
  * @param {String} query
  * @param {String} fields
  * @return {String}
**/
const getFieldsForItem = exports.getFieldsForItem = (query, fields) => {
  return getPodioItem(query)
    .then((res) => {
        let output = `*Item:* ${res.title}\n*Link:* ${res.link}\n\n`;
        return getPodioItemValues(res.item_id).then((res) => {
          return output += app.helper.listFields(res, fields)
        });
      }
    )
    .catch((err) => {
      console.log(`getFieldForItem: ${err}`);
      return `I'm sorry, I couldn't find an item by that *title*, please make sure you have the *exact* item title, put the title between quote marks and try again.`;
    });
}
/**
  * Provides message with the item's link.
  * Users must provide the item name. It depends on getPodioItem to find the right item.
  * Usage:  {name} url
  * @param {String} name
  * @return {String}
**/
const getURL = exports.getURL = (name) => getPodioItem(name).then((item) =>
  `Item: ${name}, Item Link: ${app.helper.getURL(item)}`);
/**
  * Retrieves field's value when you know the item's exact title, it depends on
  * getPodioItem to find the right item.
  * Usage:  {item} get {name}
  * @param {Object} item
  * @param {String} name
  * @return {String}
**/
const getValue = exports.getValue = (item, name) => {
  return getPodioItem(item).then((itemObj) => {
    let res = app.helper.filterFields(itemObj.fields, name);
    if (typeof res !== 'undefined') {
      //Returns either a number, string, or whole value.
      res = app.helper.checkValue(res.values[0].value);
    }
    return `Item: ${item}, Field: ${name}, Value: ${res}`;
  });
}
/**
  * Returns a list of all files matching the given filters and sorted by the specified attribute.
  * Usage: files-link --limit 20 --sort name --descending true --type item
  * @param {String} type
  * @param {Number} limit
  * @param {String} sort
  * @param {Boolean} bool
  * @return {String}
**/
const getFiles = exports.getFiles = (type = 'item', limit = 20, sort = 'name', offset = 0, bool = true) => {
  return podio.request('GET', `/file/app/${process.env.appID}/?limit=${limit}&offset=${offset}&sort_by=${sort}&sort_desc=${bool}`).then((res) => {
    return `*List of up to ${limit} files from ${type}s sorted by ${sort} in ${bool
      ? 'descending'
      : 'ascending'} order, page ${offset}:*\n${app.helper.listFiles(res)}`;
  });
}
/**
  * Writes a new field's value when you know the item's exact title, it depends on
  * getPodioItem to find the right item.
  * Usage:  {item} set {name} {value}
  * @param {String} item
  * @param {String} name
  * @param {String} value
  * @return {String}
**/
const setValue = exports.setValue = (item, name, value) => {
  return getPodioItem(item).then((itemObj) => {
    const options = itemObj.fields[1].config.settings.options;
    const item_id = app.helper.getItemID(itemObj);
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
      return `Item: ${item}, Field: ${name}, Value set to: ${value}`;
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
    if (err) errorCallback(err);
    podio.isAuthenticated().then(() => {
      callback();
    }).catch((err) => {
      errorCallback(err);
    });
  });
}

// Make API request to get push object
podio.request('get','/item/status').then(function(responseBody) {
console.log('Push Object received');
  // Deliver the push object and create a subscription
  podio.push(responseBody.push).subscribe(function(payload){
    console.log('I received a new notification!');
  })
  .then(function(){
    // The connection has been succesfully established...
  })
  .catch(function(err){
    // There was an error establishing the connection...
  });
});