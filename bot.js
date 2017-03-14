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

// Adds function to capitalize first letter and lowecase the rest to the string object.
String.prototype.titleCase = function() {
  return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}

// Function to filter array of fields
function filterFields(fields, key) {
  return fields.filter((field) => field.label === key)
}

// Function with the podio api call to get all items and filter by excat title
function filterItems(title, field) {
  const data = {
    'sort_by': 'title',
    'sort_desc': true,
    'filters': {
      title: title
    },
    'limit': 30,
    'offset': 0,
    'remember': false
  }
  return podio.request('POST', '/item/app/17912486/filter/', data)
    .then(function(responseData) {
      return responseData.items[0].fields;
    });
}

// function to get values
function getStatus(item, field, channel) {
  return filterItems(item, field)
    .then(function(fields) {
      let res = filterFields(fields, field)[0].values[0].value.text;
      rtm.sendMessage('Item: ' + item + ', Field: ' + field + ', Value(s): ' + res, channel);
    });
}

//Sets status field to value Active or Inactive
//Action: @podio set status [value: Active or Inactive]
function setStatus(itemId, msg, channel) {
  return podio.request('POST', '/app/' + process.env.appID).then(function(responseData) {
    rtm.sendMessage(msg + responseData.status.titleCase(), channel);
  });
}

function authenticatePodio(callback, errorCallback) {
  return podio.authenticateWithApp(process.env.appID, process.env.appToken, function(err) {
    return podio.isAuthenticated().then(function() {
      callback();
    }).catch(function(err) {
      errorCallback(err);
    });
  });
}

// The client will emit an RTM.AUTHENTICATED event on successful connection, with the `rtm.start` payload if you want to cache it
rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function(rtmStartData) {
  console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
  authenticatePodio(function() {
    podioAuthenticated = true;
  }, function(err) {
    console.log(err);
  });
});

// // you need to wait for the client to fully connect before you can send messages
rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, function() {
  rtm.sendMessage('Hello! Just letting you know that I\'m here if you need anything.', 'C46S9UAN5');
});

rtm.on(RTM_EVENTS.MESSAGE, function(message) {
  // Looks for '@podio title get status'
  const msg = message.text.split(' ');
  const channel = message.channel;

  if (podioAuthenticated && msg[0] === '@podio') {
    switch (true) {
      case msg[2] === 'get':
        let item = msg[1];
        let field = msg[3];
        getStatus(item, field, channel).catch(function(err) {
          console.log(err);
        });
        break;
      case msg[2] === 'set':
        //setStatus(msg[4], res, id);
        break;
      default:
        rtm.sendMessage('Sorry, wrong command', channel);
    }
  } else {
    console.log('podio is not authenticated or message was not for it.');
  }
});

rtm.start();
