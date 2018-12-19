const winston = require('winston');

let config = {
	file: {
		level: 'info',
		filename: `${__dirname}/logs/app.log`,
		handleExceptions: true,
		json: true,
		maxsize: 5242880,
		maxFiles: 10,
		colorize: false
	},
	console: {
		level: 'debug',
		handleExceptions: true,
		json: false,
		colorize: true
	}
}

var logger =  winston.createLogger({
	transports: [
		new winston.transports.File(config.file),
		new winston.transports.Console(config.console)
	],
	exitOnError: false
});

module.exports = logger;