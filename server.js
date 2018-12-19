const express = require('express');

require('dotenv').config({path: `${__dirname}/configs/config.env`});

const logger = require('./winston');
const podio = require('./app/podio');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.SERVER_PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

podio.authenticatePodio(() => {
    podio.podioAuthenticated = true;
}, () => {
    podio.podioAuthenticated = false;
});

require('./app/commands')(app, podio, logger);

app.get('*', (req, res) => {
    res.sendFile('./logs/app.log', {root: __dirname});
});

app.listen(port, () => {
    console.log(`Running service on port ${port}`);
    logger.info(`[${(new Date).toLocaleString()}]: Running service on port ${port}`);
});





