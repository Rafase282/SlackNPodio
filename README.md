# SlackNPodio

Connect Slack to Podio API. Creates `@podio` command capable of retrieving and updating information to/from podio via slack.

Add custom bot to team.<br>
Real Time Messaging API with websocket connection.

Open websocket with RTM API by sending an authenitcated call to the `rtm.start` API method.<br>
Only default messaging format supported - what types of messages does the app need?

`@podio Item-Name Action Field-Name Value`<br>
Example for retrieving information : `@podio Another get Status`<br>
Example for sending information: `@podio Another set Category R282`

## SETUP

1. Download and run `npm install`
2. Rename `sample.env` to `.env`
3. Fill out the `.env` file with the right credentials.
4. Run with `node bot.js` or `npm start`

### .env file

The following is what is needed in the `.env` file to have things working out properly.

Make sure there is no space in between the `=`.

```
botToken='key'
clientId='key'
clientSecret='key'
appToken='key'
appID='key'
```

#### API token (bot):

APP ID for PodioApp<br>
Token for PodioApp

#### PodioBot App credentials

Client ID<br>
Client Secret<br>
App ID for PodioApp<br>
Token for PodioApp
