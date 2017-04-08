# Author

![@Rafase282](https://avatars0.githubusercontent.com/Rafase282?&s=128)

Created by Rafase282

[Github](https://github.com/Rafase282) | [FreeCodeCamp](http://www.freecodecamp.com/rafase282) | [CodePen](http://codepen.io/Rafase282/) | [LinkedIn](https://www.linkedin.com/in/rafase282) | [Portfolio](https://rafase282.github.io/) | [E-Mail](mailto:rafase282@gmail.com)

[![Gitter](https://badges.gitter.im/Rafase282/SlackNPodio.svg)](https://gitter.im/Rafase282/SlackNPodio?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge) [![Code Climate](https://codeclimate.com/github/Rafase282/SlackNPodio/badges/gpa.svg)](https://codeclimate.com/github/Rafase282/SlackNPodio) [![Issue Count](https://codeclimate.com/github/Rafase282/SlackNPodio/badges/issue_count.svg)](https://codeclimate.com/github/Rafase282/SlackNPodio) [![dependencies Status](https://david-dm.org/Rafase282/SlackNPodio/status.svg)](https://david-dm.org/Rafase282/SlackNPodio) [![devDependencies Status](https://david-dm.org/Rafase282/SlackNPodio/dev-status.svg)](https://david-dm.org/Rafase282/SlackNPodio?type=dev) [![bitHound Overall Score](https://www.bithound.io/github/Rafase282/SlackNPodio/badges/score.svg)](https://www.bithound.io/github/Rafase282/SlackNPodio) [![bitHound Code](https://www.bithound.io/github/Rafase282/SlackNPodio/badges/code.svg)](https://www.bithound.io/github/Rafase282/SlackNPodio) [![bitHound Dependencies](https://www.bithound.io/github/Rafase282/SlackNPodio/badges/dependencies.svg)](https://www.bithound.io/github/Rafase282/SlackNPodio/master/dependencies/npm) [![bitHound Dev Dependencies](https://www.bithound.io/github/Rafase282/SlackNPodio/badges/devDependencies.svg)](https://www.bithound.io/github/Rafase282/SlackNPodio/master/dependencies/npm)

# SlackNPodio

Allows team members to interact with data from Podio by using commands within a Slack channel.<br>
Any team member can easily retrieve information, or make updates without ever opening a browser.<br>
Even team members without a Podio account now have the ability to interact with Podio right from within a Slack channel.

## Usage:

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
@podiobot [project name] get Status
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
@podiobot list [field name] [field value]
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

## SETUP:

1. Download and run `npm install`
2. Rename `sample.env` to `.env`
3. Fill out the `.env` file with the right credentials.
4. Run with `npm start`

## Contributing:

If you want to contribute to the project, you have to keep in mind certain guidelines.

1. We use as much functional programming as possible. Try to use pure functions whenever possible. This means the functions do one thing and one thing only. However, in some cases that will not be the case, you might have to call another function to get a value inside another and so on.
2. Functions that require interaction with the Podio API must go on the `bot/bot.js` file.
3. Functions that require interaction with the slack api must go on the `bot/slack.js` file.
4. Functions that do not interact with podio or slack directly, but rather an object or other data is a "helper function" and must go on `bot/helper.js`.
5. For every function you create, please also create a suitable test for it at `test/test-bot.js`. We also provide sample Podio API responses in case you need to work with it.
6. Please provide proper documentation for the function.

  ```javascript
  /**
  * Retrieves the ID for a field value.
  * @param {Array} options
  * @param {String} name
  * @return {Number}
  **/
  const getFieldValueID = exports.getFieldValueID = (options, value) => {
  return filterFields(options, value).id;
  }
  ```

7. Please notice that for the functions created, they have a specific declaration that allows to be used in other files via `module.exports`. This is very important and what allows us to use the helper functions inside and outside of the file, along with testing them.

  ```javascript
  const getFieldValueID = exports.getFieldValueID = (options, value) => filterFields(options, value).id;
  ```

8. Always run `npm run lint` to lint and make sure there are not things to fix.

9. Always run `npm run test` and make sure all test pass before submining a pull request. 9.
10. Last but not least, we use ES6 and beyond. So please respect that.

If you have any questions please open an issue. You can also reach me at [![Gitter](https://badges.gitter.im/Rafase282/SlackNPodio.svg)](https://gitter.im/Rafase282/SlackNPodio?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge).

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
