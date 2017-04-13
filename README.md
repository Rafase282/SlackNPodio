# SlackNPodio

Allows team members to interact with data from Podio by using commands within a Slack channel.<br>
Any team member can easily retrieve information, or make updates without ever opening a browser.<br>
Even team members without a Podio account now have the ability to interact with Podio right from within a Slack channel.

## Status:

[![Gitter](https://badges.gitter.im/Rafase282/SlackNPodio.svg)](https://gitter.im/Rafase282/SlackNPodio?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge) [![Code Climate](https://codeclimate.com/github/Rafase282/SlackNPodio/badges/gpa.svg)](https://codeclimate.com/github/Rafase282/SlackNPodio) [![Issue Count](https://codeclimate.com/github/Rafase282/SlackNPodio/badges/issue_count.svg)](https://codeclimate.com/github/Rafase282/SlackNPodio) [![dependencies Status](https://david-dm.org/Rafase282/SlackNPodio/status.svg)](https://david-dm.org/Rafase282/SlackNPodio) [![devDependencies Status](https://david-dm.org/Rafase282/SlackNPodio/dev-status.svg)](https://david-dm.org/Rafase282/SlackNPodio?type=dev) [![bitHound Overall Score](https://www.bithound.io/github/Rafase282/SlackNPodio/badges/score.svg)](https://www.bithound.io/github/Rafase282/SlackNPodio) [![bitHound Code](https://www.bithound.io/github/Rafase282/SlackNPodio/badges/code.svg)](https://www.bithound.io/github/Rafase282/SlackNPodio) [![bitHound Dependencies](https://www.bithound.io/github/Rafase282/SlackNPodio/badges/dependencies.svg)](https://www.bithound.io/github/Rafase282/SlackNPodio/master/dependencies/npm) [![bitHound Dev Dependencies](https://www.bithound.io/github/Rafase282/SlackNPodio/badges/devDependencies.svg)](https://www.bithound.io/github/Rafase282/SlackNPodio/master/dependencies/npm)

## SETUP:

1. Download and run `npm install`
2. Rename `sample.env` to `.env`
3. Fill out the `.env` file with the right credentials.
4. Run with `npm start`

## App Structure:

```
SlackNPodio/
├── bot                 //Bot App directory
│   ├── bot.js          //Handles logic related to the bot
│   ├── cmds            //Yargs commands directory
│   │   ├── files.js    //Command to get list of files
│   │   ├── get.js      //Command to get field data
│   │   ├── set.js      //Command to set field data
│   │   └── url.js      //Command to get item link
│   ├── helper.js       //Helper functions to deal with data
│   ├── podio.js        //Handles Podio api requests
│   └── slack.js        //Handles Slack events
├── LICENSE
├── package.json
├── Procfile            //Run command for Heroku
├── README.md
├── sample.env          //API keys and secrets
└── test                //Test are run here
    ├── files.js        //Sample response object for files
    ├── item.js         //Sample response object for items
    └── test-bot.js     //Test for the app
```

### bot.js:

All functions and code related to the bot goes here. This includes but is not limited to logic that specifues which functions to run based on the user input.

### helper.js:

Functions that do not directly deal with any api requests go here. This includes but is not limited to pure functions, and functions that deal with objects.

### podio.js:

Any functions or code directly related to the podio api goes here.

### slack.js:

Functions that deal directly with the slack api goes here. Normally functions to handle events, like when a message arrives and to send data to the slack chat.

### test-bot.js:

All test for the app go here.

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

### .env file:

The following is what is needed in the `.env` file to have things working out properly.

Make sure there is no space in between the `=`.

```
botToken='key'
clientId='key'
clientSecret='key'
appToken='key'
appID='key'
```

## Contact:

[Github](https://github.com/Rafase282) | [FreeCodeCamp](http://www.freecodecamp.com/rafase282) | [CodePen](http://codepen.io/Rafase282/) | [LinkedIn](https://www.linkedin.com/in/rafase282) | [Portfolio](https://rafase282.github.io/) | [E-Mail](mailto:rafase282@gmail.com)

If you like the project, please start it to receive updates and help make it more noticeable.<br>
#### If you would like to help out with financial support, you are welcome to do so via [paypal](paypal.me/rafase282).

I'm currently looking to get my career started so any amount helps. If you would like to hire me for a position or work on a project then you may also contact me about that.
