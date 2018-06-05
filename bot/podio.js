'use strict';

/* exported podioAuthenticated */

const Podio = require('podio-js').api;
const helper = require('./helper');
const bot = require('./bot');
require('dotenv').config({
    silent: true
});
const podio = new Podio({
    authType: 'app',
    clientId: process.env.clientId,
    clientSecret: process.env.clientSecret
});
const app = {
    helper,
    bot
};
exports.podioAuthenticated = false;
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
            // Returns Filtered Item Object
        return podio.request('POST', `/item/app/${process.env.appID}/filter/`, data)
            .then((res) => res.items[0]);
    }
/**
 * Podio API call to filter Items using multiple filters
 * @param {String} filters
 * @return {Object}
 **/
exports.getPodioItemsByFilters = (filters) => {
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
                let filteredItems = app.helper.filterItems(filters, res.items);
                return app.helper.listItems(filteredItems);
            })
            .catch((err) => `${err}`);
    }
/**
 * Returns an object with all the info related to the Podio Item identify by the ID provided
 * @param {Number} itemId
 * @return {Object}
 **/
exports.showAllFields = (query) => {
        return getPodioItem(query)
            .then((res) => {
                let output = `*Item:* ${res.title}\n*Link:* ${res.link}\n\n`;
                return getPodioItemValues(res.item_id).then((res) => {
                        return output += app.helper.listAllFields(res);
                    })
                    .catch((err) => `${err}`);
            })
            .catch(() => {
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
exports.getItemsList = (name) => {
        return getPodioItems(name, 50, 'title', true, true, 0, 'item').then((res) => app.helper.listItems(res.results));
    }
/**
 * Returns a list of requested fields for the specified Item
 * Usage: {query} query fields
 * @param {String} query
 * @param {String} fields
 * @return {String}
 **/
exports.getFieldsForItem = (query, fields) => {
        return getPodioItem(query)
            .then((res) => {
                let output = `*Item:* ${res.title}\n*Link:* ${res.link}\n\n`;
                return getPodioItemValues(res.item_id).then((res) => {
                    return output += app.helper.listFields(res, fields)
                });
            })
            .catch(() => {
                return `I'm sorry, I couldn't find an item by that *title*, please make sure you have the *exact* item title, put the title between quote marks and try again.`;
            });
    }
/**
 * Retrieves field's value when you know the item's exact title, it depends on
 * getPodioItem to find the right item.
 * Usage:  {item} get {name}
 * @param {Object} item
 * @param {String} name
 * @return {String}
 **/
exports.getValue = (item, name) => {
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
exports.getFiles = (type = 'item', limit = 20, sort = 'name', offset = 0, bool = true) => {
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
exports.setValue = (item, name, value) => {
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
            return podio.request('PUT', `/item/${item_id}/value/`, data).then(() => {
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
exports.authenticatePodio = (callback, errorCallback) => {
        return podio.authenticateWithApp(process.env.appID, process.env.appToken, (err) => {
            if (err) errorCallback(err);
            podio.isAuthenticated().then(() => {
                callback();
            }).catch((err) => {
                errorCallback(err);
            });
        });
    }
/**
 * Authenticates the bot with the podio api.
 * @param {Function} callback
 * @param {Function} errorCallback
 * @return {Boolean}
 **/
exports.permissionCheck = (permission, callback, args) => {
        if (permission) {
            return callback(...args).then((res) => {
                bot.cb(res);
            });
        } else {
            bot.cb('The required permission for this action is disabled.')
        }
    }
    // Make API request to get push object
podio.request('get', '/item/status').then((responseBody) => {
    // Deliver the push object and create a subscription
    podio.push(responseBody.push).subscribe(() => {
            // You recived a push notification
        })
        .then(() => {
            // The connection has been succesfully established...
        })
        .catch(() => {
            // There was an error establishing the connection...
        });
});