const { createLogger, transports, format } = require('winston');

const logger = createLogger({
    level: 'info',

    transports: [
        new transports.Console({
            level: 'info',
            format: format.combine(format.json())
        }),
        new transports.File({
            filename: 'logger/error.logs',
            level: 'error',
            format: format.combine(format.timestamp(), format.json())
        })
    ],

    exceptionHandlers: [
        new transports.Console({
            filename: 'logger/exceptions.logs',
            level: 'exceptions'
        })
    ]
});

module.exports = logger;
