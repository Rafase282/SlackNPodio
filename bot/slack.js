'use strict';

require('dotenv').config();
const {
    RTMClient,
    WebClient
} = require('@slack/client');
const slackToken = process.env.botToken;
// The client is initialized and then started to get an active connection to the platform
const slack = new RTMClient(slackToken);
slack.start();

// Need a web client to find a channel where the app can post a message
const web = new WebClient(slackToken);

const podio = require('./podio');
const helper = require('./helper');
const bot = require('./bot');
const app = {
    podio,
    helper,
    bot
};
let channel = null
    // Load the current channels list asynchrously
web.channels.list()
    .then((res) => {
        // Take any channel for which the bot is a member
        channel = res.channels.find((chan) => chan.is_member);

        if (channel) {
            // We now have a channel ID to post a message in!
            // use the `sendMessage()` method to send a simple string to a channel using the channel ID
            slack.sendMessage("Hello there! Just letting you know that I'm here if you need anything.", channel.id);
        } else {
            //console.log('This bot does not belong to any channel, invite it to at least one and try again');
        }
    });

// On successful connection authenticate podio
slack.on('message', (message) => {
    // Skip messages that are from a bot or my own user ID
    if (!message.subtype ||
        (!message.subtype && message.user !== slack.activeUserId)) {
        app.podio.authenticatePodio(() => {
            app.podio.podioAuthenticated = true;
            app.bot.logic(message.text, (msg) => {
                if (msg) {
                    slack.sendMessage(msg, channel.id);
                }
            });
        }, () => {
            app.podio.podioAuthenticated = false;
        });

    }
});