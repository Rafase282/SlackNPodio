'use strict';

const RtmClient = require('@slack/client').RtmClient;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
require('dotenv').config({silent: true});
const slack = new RtmClient(process.env.botToken);
const podio = require('./podio');
const helper = require('./helper');
const bot = require('./bot');
const app = {podio, helper, bot};
/**
 * Event handler for when the bot is authenticated with Podio
 * The client will emit an RTM.AUTHENTICATED event on successful connection,
 * with the `slack.start` payload if you want to cache it.
 * @param {Stream} rtmStartData
 * @return {Log}
 **/
slack.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) => {
  console.log(`Slack API: Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name},` +
    `but not yet connected to a channel.`);
  app.podio.authenticatePodio(() => {
    app.podio.podioAuthenticated = true;
  }, (err) => {
    console.log('ERROR CB:',err);
  });
});

/**
 * Event handler for when the bot connects to slack.
 * You need to wait for the client to fully connect before you can send messages.
 **/
slack.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => {
  slack.sendMessage(`Hello! Just letting you know that I'm here if you need anything.`, 'C46S9UAN5');
});
/**
 * Event handler for when a messaged is posted on the slack channel.
 * It call the bot to handle the input and run the propect action.
 * Then gets the message to show on the channel.
 * @param {Object} message
 * @return {String}
 **/
slack.on(RTM_EVENTS.MESSAGE, (message) => {
  app.bot.logic(message.text, (msg)=>{
    if (msg) {
      slack.sendMessage(msg, message.channel);
    }
  });
});

slack.start();
