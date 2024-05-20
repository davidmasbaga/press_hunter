const winston = require('winston');
const { combine, timestamp, json } = winston.format;
const moment = require('moment-timezone');

const regex = /\+\d\d:\d\d/g;

const logger = winston.createLogger({
  level: 'info',
  format: combine(timestamp({
    format: () => moment().tz("Europe/Madrid").format().replace(regex,'')
   }), json()),

  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

logger.add(new winston.transports.Console({ format: winston.format.simple() }));

module.exports = function buildLogger(service) {
  return {
    log: (message) => {
      logger.log('info', { message, service });
    },
    error: (message) => {
      logger.error(
        ('error',
        {
          message,
          service,
          
        })
      );
    },
  };
};
