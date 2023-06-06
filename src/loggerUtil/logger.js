const {createLogger, format, transports} = require('winston');

const DEFAULT_LOG_FOLDER = 'src/logs';

const logger = createLogger({
  level: 'info',
  format: format.combine(
      format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
      format.printf(({timestamp, level, message}) => {
        return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
      }),
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: `${DEFAULT_LOG_FOLDER}/logs.log`,
      maxsize: 1 * 1024 * 1024, // 1MB
      maxFiles: 2, // Number of backup files to keep
      tailable: true, // Enable file rotation
      zippedArchive: true,
    }),
  ],
});

module.exports = logger;
