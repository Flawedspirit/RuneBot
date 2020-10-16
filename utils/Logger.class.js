/* REQUIRED DEPENDENCIES */
const chalk     = require('chalk');

/**
 * @class
 * @classdesc Utility for logging text to the console.
 */
class Logger {
    /**
     * @constructor
     * @arg {Boolean} logTimestamps If a timestamp should be displayed.
     * @arg {String} color A [valid chalk color]{@link https://github.com/chalk/chalk#colors} to use for log output.
     */
    constructor(logTimestamps, color) {
        this.logTimestamps = !!logTimestamps;
        this.color = color;
    }

    /**
     * A locale-defined timestamp
     * @type String
     */
    get timestamp() {
        return this.logTimestamps === true ? chalk.whiteBright.bold(`[${new Date().toLocaleString()}] `) : '';
    }

    /**
     * Logs something to the console
     * @param {String} message Log message
     * @param {String} [color] A [valid chalk color]{@link https://github.com/chalk/chalk#colors}
     * @returns {String}
     */
    log(message, color) {
        return console.log(this.timestamp + (color ? chalk[color](message) : message));
    }

    /**
     * Logs something to the console in bolder formatting
     * @param {String} message Log message
     * @param {String} [color] A [valid chalk color]{@link https://github.com/chalk/chalk#colors}
     * @returns {String}
     */
    logBold(message, color) {
        return console.log(this.timestamp + (color ? chalk.bold[color](message) : chalk.bold(message)));
    }

    /**
     * Logs a debug message to the console
     * @param {String} message Log message
     * @param {String} [header="DEBUG"] A custom header message before output
     * @returns {String}
     */
    logDebug(message, header = 'DEBUG') {
        return console.log(this.timestamp + chalk.bgBlueBright.black(`[${header}] ` + message));
    }

    /**
     * Logs a warning to the console<br />
     * A warning is typically a recoverable incident or minor misconfiguration
     * @param {String} message Log message
     * @param {String} [header="WARN"] A custom header message before output
     * @returns {String}
     */
    logWarn(message, header = 'WARN') {
        return console.log(this.timestamp + chalk.bgYellow.black(`[${header}] ` + message));
    }

    /**
     * Logs an error to the console<br />
     * An error is non-recoverable and stops the bot from running
     * @param {String} message Log message
     * @param {String} [header="ERROR"] A custom header message before output
     * @returns {String}
     */
    logError(message, header = 'ERROR') {
        return console.log(this.timestamp + chalk.bgRed.black(`[${header}] ` + message));
    }

    /**
     * Checks if supplied color is a valid chalk color
     * @param {String} color A color
     * @returns {Boolean}
     */
    isValidColor(color) {
        return typeof chalk[color] === 'function';
    }
}

module.exports = Logger;
