# SlackNPodio
Allows team members to interact with data from Podio by using commands within a Slack channel.  
Any team member can easily retrieve information, or make updates without ever opening a browser.  
Even team members without a Podio account now have the ability to interact with Podio right from within a Slack channel.

<b>Get Command</b>: Retrieve field values.<br>
As a Project Stakeholder, I want to retrieve the expected delivery date for my project without logging into Podio so that I can not be frustrated by my lost password or lack of setup account.<br>
//Command// @podiobot [project name] get Delivery Date <br>
//Response// @podiobot: [project name] will be delivered by [delivery date value].

As a Project Manager, I want to direct team members to request project status by asking the bot before coming to me so that I can spend more of my time planning than responding to messages.<br>
//Command// @podiobot [project name] get Status<br>
//Response// @podiobot: [project name] Status: [Status value]


<b>Set Command</b>: Update field values.<br>
As a QA Manager, I want to update the status of a project to ‘Production Ready’ once I hear back from my QA lead so that I don’t have to open a browser, log into Podio, search for the project and make the update.<br>
//Command// @podiobot [project name] set Status Production Ready<br>
//Response// @podiobot: [project name] Status: Production Ready


<b>List Command</b>: Provides a list of items which match a specific field value.<br>
As a Digital Marketing Manager, I want to see a list of all currently live campaigns so I can make sure a specific campaign launched on time as expected.<br>
//Command// @podiobot list [field name] [field value]<br>
//Response// list of [item title] who’s [field name] is equal to [field value]


<b>Help Command</b>: Provide information on how to interact with the bot.<br>
As any User, I want to learn how to use all of the podiobot commands so I can benefit from the conveniences they provide.<br>
//Command// @podiobot help<br>
//Response// [List available commands with descriptions]

As any User, I want to learn how to utilize these commands so that I can use all the great features within podiobot.<br>
//Command//@podiobot help [command]<br>
//Response//@podiobot: The proper syntax for the [command] is: [command syntax]


-----------------------------
Connects Slack to Podio API.  
Creates `@podiobot` command capable of retrieving and updating information to/from podio via slack.
Adds custom bot to team.
Real Time Messaging API with websocket connection.
Open websocket with RTM API by sending an authenitcated call to the `rtm.start` API method.

## SETUP

1. Download and run `npm install`
2. Rename `sample.env` to `.env`
3. Fill out the `.env` file with the right credentials.
4. Run with `node bot.js` or `npm start`

Optionally, you can llint with `npm run lint`

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

APP ID for PodioApp
Token for PodioApp

#### PodioBot App credentials

Client ID<br>
Client Secret<br>
App ID for PodioApp<br>
Token for PodioApp
