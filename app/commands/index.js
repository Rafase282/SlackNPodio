const qs = require('querystring');
const axios = require('axios');

module.exports = (app, podio, logger) => {
    app.post('/abtest/dev', (req, res) => {
        let [command, ...args] = req.body.text.split(' ');
        let response_url = req.body.response_url;
        logger.info(`[${(new Date).toLocaleString()}]: ${req.body.user_name} used ${command} with args: ${args.join(',')}`);
        switch(command) {
            case 'brief':
                res.send(require('./brief')(podio, args));
                break;
            case 'vertical':
            case 'assigned':
                res.send({
                    'response_type': 'in_channel',
                    text: 'Loading data, please wait...'
                });
                require('./vertical')(podio, args).then((msg) => {
                    sendSlackMessage(response_url, msg);
                });
                break;
            case 'search':
                res.send({
                    'response_type': 'in_channel',
                    text: 'Loading data, please wait...'
                });
                require('./search')(podio, args).then((msg) => {
                    sendSlackMessage(response_url, msg);
                });
                break;
            case 'show':
                res.send({
                    'response_type': 'in_channel',
                    text: 'Loading data, please wait...'
                });
                require('./show')(podio, args).then((msg) => {
                    sendSlackMessage(response_url, msg);
                });
                break;
            case 'live':
                res.send({
                    'response_type': 'in_channel',
                    text: 'Loading data, please wait...'
                });
                require('./live')(podio, []).then((msg) => {
                    sendSlackMessage(response_url, msg);
                });
                break;
            case 'queue':
                res.send({
                    'response_type': 'in_channel',
                    text: 'Loading data, please wait...'
                });
                require('./queue')(podio, []).then((msg) => {
                    sendSlackMessage(response_url, msg);
                });
                break;
            case 'help':
                res.send(require('./help')(podio, args));
                break;
        }
    });
}

let sendSlackMessage = (response_url, msg, response_type = "in_channel") => {
    axios.post(response_url, {
        'response_type': response_type,
        text: msg
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).catch(error => {
        //console.log(error.response);
    });
}