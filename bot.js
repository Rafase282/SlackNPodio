var RtmClient = require('@slack/client').RtmClient;
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;

var Podio = require('podio-js').api;

require('dotenv').config({
  silent: true
});

var bot_token = process.env.botToken;
var rtm = new RtmClient(bot_token);
var podio;
var podioAuthenticated = false;

// get the API id/secret
var clientId = process.env.clientId;
var clientSecret = process.env.clientSecret;

// get the app ID and Token for appAuthentication
var appId = process.env.appID;
var appToken = process.env.appToken;

// The client will emit an RTM.AUTHENTICATED event on successful connection, with the `rtm.start` payload if you want to cache it
rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function (rtmStartData) {
    console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
    authenticatePodio(function() {
        podioAuthenticated = true;
    }, function(err) {
        console.log(err);
    });
});

function getTitle() {
    var externalId = 'title';
    return podio.request('GET', '/app/' + appId + '/field/' + externalId).then(function(responseData) {
        return responseData.status;
    })
}

// // you need to wait for the client to fully connect before you can send messages
// rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, function () {
//     rtm.sendMessage("Hello!", channelId);
// });

rtm.on(RTM_EVENTS.MESSAGE, function (message) {
    // TODO : look for /podio command somehow
    // Looks for "podio status"
    var channelId = message.channel;
    var split = message.text.split(' ');
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
    // instantiate the SDK
    podio = new Podio({
        authType: 'app', // or client
        clientId: clientId,
        clientSecret: clientSecret
    });

    return podio.authenticateWithApp(appId, appToken, function(err) {
        return podio.isAuthenticated().then(function() {
            callback();
        }).catch(function(err) {
            errorCallback(err);
        });
    });
}
