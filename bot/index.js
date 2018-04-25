require('dotenv').config({silent: true});
import express from 'express';
import bodyParser from 'body-parser';
import httpReq from 'request-promise';
import {logic} from './bot';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
  res.send('Slack Server Started');
});

app.post('/slack-command', async (req, res) => {
  const {token, team_id, command, response_url} = req.body;
  // We send the empty response first always and then we process the command
  // Why ? Because if we dont send the empty response and our command took
  // more time to execute then slack will think command failed. So once we execute
  // our command we will send response using response_url
  res.send('We are processing your input :male-technologist:');

  let responseOptions = {
    uri: response_url,
    method: 'POST',
    body: {},
    headers: {
      'content-type': 'application/json'
    },
    json: true
  };

  try {
    // First check whether request is coming from our team_id and verified_token
    if (
      token === process.env.SLACK_VERIFICATION_TOKEN &&
      team_id === process.env.SLACK_TEAM_ID
    ) {
      logic('analytics', req.body.text, (text) => {
        if (text) {
          httpReq({
            ...responseOptions,
            body: {
              response_type: 'in_channel',
              text
            }
          });
        }
      });
    } else {
      responseOptions.body = {
        response_type: 'in_channel',
        attachments: [
          {
            color: 'danger',
            text: 'Sorry you are not authorized to use this command :hushed:'
          }
        ],
        text: ''
      };
      httpReq(responseOptions);
    }
  } catch (e) {
    responseOptions.body = {
      attachments: [
        {
          color: 'danger',
          text: 'Something went wrong',
          fields: [
            {
              title: 'Error',
              value: e.toString(),
              short: false
            }
          ]
        }
      ],
      text: ''
    };
    httpReq(responseOptions);
  }
});

app.listen(process.env.SERVER_PORT || 80, () =>
  console.log(`Server started on port ${process.env.SERVER_PORT}!`)
);
