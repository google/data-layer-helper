goog.module('dataLayerHelper.logging');

/**
 * @define {boolean} When true, potential code errors will be logged to the
 * console. To enable this, run yarn build-debug to compile the distribution
 * code.
 */
const DLH_DEBUG = goog.define('DLH_DEBUG', false);

/**
 * Enum for choosing the level at which to log an error.
 * @readonly
 * @enum {number}
 */
const LogLevel = {
  INFO: 1,
  WARNING: 2,
  ERROR: 3,
};

/**
 * Log an error to the console if the debug distribution is in use.
 *
 * @param {string} toLog The error to log to the console in debug mode.
 * @param {!LogLevel} logLevel The error to log to the console in debug mode.
 */
function log(toLog, logLevel) {
  if (DLH_DEBUG) {
    switch (logLevel) {
      case LogLevel.INFO:
        console.log(toLog);
        break;
      case LogLevel.WARNING:
        console.warn(toLog);
        break;
      case LogLevel.ERROR:
        console.error(toLog);
        break;
      default:
    }
  }
}

exports = {
  LogLevel,
  log,
};
