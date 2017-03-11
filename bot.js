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

function getTitle() {
  let externalId = 'title';
  return podio.request('GET', '/app/' + process.env.appID).then(function(responseData) {
    console.log(responseData);
    return responseData.status;
  })
}

// // you need to wait for the client to fully connect before you can send messages
rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, function() {
  rtm.sendMessage("Hello! Just letting you know that I'm here if you need anything.", 'C46S9UAN5');
});

rtm.on(RTM_EVENTS.MESSAGE, function(message) {
  // TODO : look for /podio command somehow
  // Looks for "podio status"
  let channelId = message.channel;
  let split = message.text.split(' ');
  if (split[1] === 'status') {
    if (podioAuthenticated) {
      getTitle().then(function(status) {
        // Call Podio API
        rtm.sendMessage('Title status: ' + status, channelId);
      }).catch(function(err) {
        console.log(err);
      });
    } else {
      console.log('podio is not authenticated');
    }
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
