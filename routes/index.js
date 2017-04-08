/*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
'use strict';

const express = require('express');
const router = express.Router();
const PodioJS = require('podio-js').api;
const sessionStore = require('./sessionStore.js');
const Busboy = require("busboy");
const temp = require('temp');
const fs = require('fs');
require('dotenv').config({silent: true});
const clientId = process.env.clientId;
const clientSecret = process.env.clientSecret;
const bot = require('./bot.js');
const podio = exports.podio = new PodioJS({
  authType: 'server',
  clientId,
  clientSecret
}, {sessionStore});
const RtmClient = require('@slack/client').RtmClient;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
const rtm = exports.rtm = new RtmClient(process.env.botToken);

// The client will emit an RTM.AUTHENTICATED event on successful connection,
// with the `rtm.start` payload if you want to cache it
rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) => {
  console.log(
    `Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name},`
    + `but not yet connected to a channel.`
  );
});

// you need to wait for the client to fully connect before you can send messages
rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => {
  rtm.sendMessage(
    `Hello! Just letting you know that I'm here if you need anything.`,
    'C46S9UAN5'
  );
});

rtm.on(RTM_EVENTS.MESSAGE, (message) => {
  // Looks for '@podio title get status'
  const msg = message.text.split(' ');
  if (msg[0] === '@podio') {
    const channel = message.channel;
    const item = msg[1];
    const action = msg[2];
    const field = msg[3];
    const value = msg[4];
    switch (true) {
      case action === 'get':
        bot.getStatus(item, field, channel).catch((err) => {
          console.log(err);
        });
        break;
      case action === 'set':
        bot.setStatus(item, field, value, channel).catch((err) => {
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

/* This part and bellow is part of the express and site part
   the part above is for the bot
*/

function getFullURL(req) {
  return req.protocol + '://' + req.get('host') + '/';
}

/* GET home page. */
router.get('/', (req, res) => {
  const authCode = req.query.code;
  const errorCode = req.query.error;
  const redirectURL = getFullURL(req);

  podio.isAuthenticated()
  .then(() => {
    // ready to make API calls
    rtm.start();
    res.render('success');
  }).catch(() => {

    if (typeof authCode !== 'undefined') {
      podio.getAccessToken(authCode, redirectURL, (err) => {
        if(err !== null) {
          // we have catched an error
          res.render('error', { description: 'Error:' + err.status + " / " + err.message });
        } else {
          // ready to make API calls
          rtm.start();
          res.render('success');
        }
      });
    } else if (typeof errorCode !== 'undefined') {
      // an error occured
      res.render('error', { description: req.query.error_description });
    } else {
      // we have neither an authCode nor have we authenticated before
      res.render('index', { authUrl: podio.getAuthorizationURL(redirectURL) });
    }
  });
});

router.get('/user', (req, res) => {

  podio.isAuthenticated()
  .then(() => {
    return podio.request('get', '/user/status');
  })
  .then((responseData) => {
    res.render('user', { profile: responseData.profile });
  })
  .catch((err) => {
    console.log(err);
    res.send(401);
  });
});

router.get('/upload', (req, res) => {
  res.render('upload');
});

router.post('/upload', (req, res) => {
  const busboy = new Busboy({ headers: req.headers });

  podio.isAuthenticated()
  .then(() => {

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {

      const dir = temp.mkdirSync();
      const filePath = dir + '/' + filename;

      fs.writeFileSync(filePath, '');

      file.on('data', (data) => {
        fs.appendFileSync(filePath, data);
      });

      file.on('end', () => {
        podio.uploadFile(filePath, filename)
        .then(function(body, response) {
          res.render('upload_success', { fileId: body.file_id })
        })
        .catch((err) => {
          res.end(String(err));
        });
      });
    });
    req.pipe(busboy);
  })
  .catch(() => {
    res.send(401);
  });
});

module.exports = router;
