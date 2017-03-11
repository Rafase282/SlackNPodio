const RtmClient = require('@slack/client').RtmClient;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
const Podio = require('podio-js').api;
require('dotenv').config({
  silent: true
});
let podioAuthenticated = false;
const rtm = new RtmClient(process.env.botToken);
const podio = new Podio({
  authType: 'app', // or client
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret
});

// The client will emit an RTM.AUTHENTICATED event on successful connection, with the `rtm.start` payload if you want to cache it
rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function(rtmStartData) {
  console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
  authenticatePodio(function() {
    podioAuthenticated = true;
  }, function(err) {
    console.log(err);
  });
});

// Adds function to capitalize first letter and lowecase the rest tot he string object.
String.prototype.titleCase = function() {
  return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}

function getTitle(title) {
  return podio.request('GET', '/app/' + process.env.appID).then(function(responseData) {
    console.log(responseData);
    return responseData.status;
  })
}

/* Get status and sends it as a message
 * Needs an item id for the api
 * A message to send to the user
 * Channel id to send the message to.
 */
function getStatus(itemId, msg, channel) {
  return podio.request('GET', '/app/' + process.env.appID).then(function(responseData) {
    rtm.sendMessage(msg + responseData.status.titleCase(), channel);
  });
}

// // you need to wait for the client to fully connect before you can send messages
rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, function() {
  rtm.sendMessage("Hello! Just letting you know that I'm here if you need anything.", 'C46S9UAN5');
});

rtm.on(RTM_EVENTS.MESSAGE, function(message) {
  // Looks for "@podio title get status"
  let msg = message.text.split(' ');
  const channel = message.channel;
  if (podioAuthenticated && msg[0] === '@podio') {
    switch (true) {
      case msg[2] === 'get' && msg[3] == 'status':
        getStatus(msg[1], msg[1].titleCase() + ' status: ', channel);
        /*getTitle(msg[1]).then(function(status) {
          rtm.sendMessage('Title status: ' + status, channelId);
        }).catch(function(err) {
          console.log(err);
        });*/
        break;
      case msg[2] === 'set' && msg[3] === 'status':
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


function authenticatePodio(callback, errorCallback) {
  return podio.authenticateWithApp(process.env.appID, process.env.appToken, function(err) {
    return podio.isAuthenticated().then(function() {
      callback();
    }).catch(function(err) {
      errorCallback(err);
    });
  });
}
