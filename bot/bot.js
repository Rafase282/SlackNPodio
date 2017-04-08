/*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
'use strict';

const RtmClient = require('@slack/client').RtmClient;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
const Podio = require('podio-js').api;
const bot = require('./helper');
require('dotenv').config({silent: true});
const rtm = new RtmClient(process.env.botToken);
const podio = new Podio({
  authType: 'app', // or client
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret
});
let podioAuthenticated = false;

 /**
  * Podio API call to filter items by excat titles.
  *
  * Note: Also providing a "property" for the filter would allows us to filter
  * by anything other than the title. Something useful for the new get/list.
  * However, this API calls required an excat match although it is not case sensitive.
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
  `Item: ${name}, Item Link: ${bot.getURL(item)}`);
/**
 * Retrieves field's value when you know the item's excat title, it depends on
 * getPodioItem to find the right item.
 * Usage: @podio {item} get {name}
 * @param {String} item
 * @param {String} name
 * @return {String}
 **/
const getValue = exports.getValue = (item, name) => {
  return getPodioItem(item).then((item) => {
    let res = bot.filterFields(item.fields, name);
    if (typeof res !== 'undefined') {
      //Returns either a number, string, or whole value.
      res = bot.checkValue(res.values[0].value);
    }
      return `Item: ${item}, Field: ${name}, Value: ${res}`;
  });
}
/**
 * Writes a new field's value when you know the item's excat title, it depends on
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
    const item_id = bot.getItemID(item);
    let fieldID = value;
    let data = {};
    if (name === 'Category' || name === 'category') {
      fieldID = bot.getFieldValueID(options, value);
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
function authenticatePodio(callback, errorCallback) {
  return podio.authenticateWithApp(process.env.appID, process.env.appToken, (err) => {
    errorCallback(err);
    return podio.isAuthenticated().then(() => {
      callback();
    }).catch((err) => {
      errorCallback(err);
    });
  });
}
/**
 * Event handler for when the bot is authenticated with Podio
 * The client will emit an RTM.AUTHENTICATED event on successful connection,
 * with the `rtm.start` payload if you want to cache it.
 * @param {Stream} rtmStartData
 * @return {Log}
 **/
rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) => {
  console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name},` +
    `but not yet connected to a channel.`);
  authenticatePodio(() => {
    podioAuthenticated = true;
  }, (err) => {
    console.log(err);
  });
});

/**
 * Event handler for when the bot connects to slack.
 * You need to wait for the client to fully connect before you can send messages.
 **/
rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => {
  rtm.sendMessage(`Hello! Just letting you know that I'm here if you need anything.`, 'C46S9UAN5');
});
/**
 * Event handler for when a messaged is posted on the slack channel.
 * The message will be split to look for keywords containing the commands and data
 * needed to excecute the user's desired actions.
 * The logic that controls what gets called is here.
 * @param {String} message
 * @return {String}
 **/
rtm.on(RTM_EVENTS.MESSAGE, (message) => {
  const msg = message.text.split(' ');
  if (podioAuthenticated && msg[0] === '@podio') {
    const channel = message.channel;
    const item = msg[1];
    const action = msg[2];
    const field = msg[3];
    const value = msg[4];
    switch (true) {
      case action === 'get':
        getValue(item, field, channel).catch((err) => {
          console.log(err);
        }).then((msg) => rtm.sendMessage(msg, channel));
        break;
      case action === 'set':
        setValue(item, field, value, channel).catch((err) => {
          console.log(err);
        }).then((msg) => rtm.sendMessage(msg, channel));
        break;
      case action === 'url':
        getURL(item).catch((err) => {
          console.log(err);
        }).then((msg) => rtm.sendMessage(msg, channel));
        break;
      case item === 'help':
        rtm.sendMessage(bot.showHelp(), channel);
        break;
      default:
        rtm.sendMessage('Sorry, wrong command', channel);
    }
  } else {
    console.log('podio is not authenticated or message was not a command.');
  }
});

rtm.start();
