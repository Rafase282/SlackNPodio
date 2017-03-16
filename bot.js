/*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
'use strict';

const RtmClient = require('@slack/client').RtmClient;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
const Podio = require('podio-js').api;
require('dotenv').config({silent: true});
let podioAuthenticated = false;
const rtm = new RtmClient(process.env.botToken);
const podio = new Podio({
  authType: 'app', // or client
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret
});

// Function to filter array of fields
function filterFields(fields, key) {
  return fields.filter((field) => field.label === key)
}

// Function with the podio api call to get all items and filter by excat title
function filterItems(item_name) {
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
  return podio.request('POST', '/item/app/17912486/filter/', data).then((res) => res.items);
}

function getItemID(items_arr) {
  return items_arr[0].item_id;
}

function getFieldID(items_arr, field_name) {
  return filterFields(items_arr[0].fields, field_name)[0].field_id;
}

// function to get values
function getStatus(item_name, field_name, channel) {
  return filterItems(item_name).then((items) => {
    const res = filterFields(items[0].fields, field_name)[0].values[0].value.text;
    rtm.sendMessage('Item: ' + item_name + ', Field: ' + field_name + ', Value(s): ' + res, channel);
  });
}

// Sets status field to value Active or Inactive
//Action: @podio set status [value: Active or Inactive]
function setStatus(item_name, field_name, field_value, channel) {
  const data = {
    "values": field_value
  };
  return filterItems(item_name).then((item) => {
    const item_id = getItemID(item);
    const fieldID = getFieldID(item, field_name);
    console.log(item[0].fields[0]);
    return podio.request('PUT', `/item/${item_id}/value/${fieldID}`, data).then((res) => {
      rtm.sendMessage('Item: ' + item_name + ', Field: ' + field_name + ', Value(s): ' + res, channel);
    });
  });
}

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

// The client will emit an RTM.AUTHENTICATED event on successful connection, with the `rtm.start` payload if you want to cache it
rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) => {
  console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
  authenticatePodio(() => {
    podioAuthenticated = true;
  }, (err) => {
    console.log(err);
  });
});

// // you need to wait for the client to fully connect before you can send messages
rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => {
  rtm.sendMessage('Hello! Just letting you know that I\'m here if you need anything.', 'C46S9UAN5');
});

rtm.on(RTM_EVENTS.MESSAGE, (message) => {
  // Looks for '@podio title get status'
  const msg = message.text.split(' ');

  if (podioAuthenticated && msg[0] === '@podio') {
    const channel = message.channel;
    const item = msg[1];
    const action = msg[2]
    const field = msg[3];
    const value = msg[4];
    switch (true) {
      case action === 'get':
        getStatus(item, field, channel).catch((err) => {
          console.log(err);
        });
        break;
      case action === 'set':
        setStatus(item, field, value, channel).catch((err) => {
          console.log(err);
        });
        break;
      default:
        rtm.sendMessage('Sorry, wrong command', channel);
    }
  } else {
    console.log('podio is not authenticated or message was not for it.');
  }
});

rtm.start();
