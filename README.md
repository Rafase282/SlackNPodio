# SlackNPodio

Allows team members to interact with data from Podio by using commands within a Slack channel.<br>
Any team member can easily retrieve information, or make updates without ever opening a browser.<br>
Even team members without a Podio account now have the ability to interact with Podio right from within a Slack channel.

## Usage

```
command
response
```

**Get Command**: Retrieve field values.

As a Project Stakeholder, I want to retrieve the expected delivery date for my project without logging into Podio so that I can not be frustrated by my lost password or lack of setup account.

```
@podiobot [project name] get Delivery Date
@podiobot: [project name] will be delivered by [delivery date value].
```

As a Project Manager, I want to direct team members to request project status by asking the bot before coming to me so that I can spend more of my time planning than responding to messages.

```
@podiobot [project name] get Status<br>
@podiobot: [project name] Status: [Status value]
```

**Set Command**: Update field values.

As a QA Manager, I want to update the status of a project to 'Production Ready' once I hear back from my QA lead so that I don't have to open a browser, log into Podio, search for the project and make the update.

```
@podiobot [project name] set Status Production Ready
@podiobot: [project name] Status: Production Ready
```

**List Command**: Provides a list of items which match a specific field value.

As a Digital Marketing Manager, I want to see a list of all currently live campaigns so I can make sure a specific campaign launched on time as expected.

```
@podiobot list [field name] [field value]<br>
list of [item title] who's [field name] is equal to [field value]
```

**Help Command**: Provide information on how to interact with the bot.

As any User, I want to learn how to use all of the podiobot commands so I can benefit from the conveniences they provide.

```
@podiobot help
[List available commands with descriptions]
```

As any User, I want to learn how to utilize these commands so that I can use all the great features within podiobot.

```
@podiobot help [command]
@podiobot: The proper syntax for the [command] is: [command syntax]
```

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
