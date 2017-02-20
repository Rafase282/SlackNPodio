var Keys = require('./keys');

var RtmClient = require('@slack/client').RtmClient;
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;

var bot_token = Keys.botToken();

var rtm = new RtmClient(bot_token);

var channelId;

var podio = require('./podio-js');

// The client will emit an RTM.AUTHENTICATED event on successful connection, with the `rtm.start` payload if you want to cache it
rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function (rtmStartData) {
    var channels = rtmStartData.channels;
    for (var i = 0; i < channels.length; i++) {
        var channel = channels[i];
        if (channel.name === 'general') {
            channelId = channel.id;
        }
    }

    console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
});

// // you need to wait for the client to fully connect before you can send messages
// rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, function () {
//     rtm.sendMessage("Hello!", channelId);
// });

rtm.on(RTM_EVENTS.MESSAGE, function (message) {
    // TODO : look for /podio command somehow
    console.log(message);
    var channelId = message.channel;
    var split = message.text.split(' ');
    if (split[1] === 'data') {
        // Call Podio API
        rtm.sendMessage('Getting podio data', channelId);
    }
});


rtm.start();







    //Setup the API client

    var podio = new Podio({
        authType: 'client',
        clientId: clientId,
        clientSecret: clientSecret
      });


    //Authenticate
    const Podio = require('./podio-js').api;

    // Example config file where you might store your credentials
    import Keys from '../keys.js'

    // get the API id/secret
    const clientId = Keys.clientId;
    const clientSecret = Keys.clientSecret;

    // get the app ID and Token for appAuthentication
    const appId = Keys.appId;
    const appToken = Keys.appToken;

    // instantiate the SDK
    const podio = new Podio({
      authType: 'app',
      clientId: clientId,
      clientSecret: clientSecret
    });

    podio.authenticateWithApp(appId, appToken, (err) => {

      if (err) throw new Error(err);

      podio.isAuthenticated().then(() => {
        // Ready to make API calls in here...

      }).catch(err => console.log(err));

    });



    //Make your API calls

    podio.request('GET', '/tasks', null, function(responseData) {
      // do something with the data
      console.log(responseData);
    });
