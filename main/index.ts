import Logger from "./logger.js";

let logger = new Logger('First Logger');
Logger.getLoggerCount();
logger.TIMER_START("Started!");

setTimeout(() => {
    logger.TIMER_END("Started!");
}, 1000);

logger.INFO("Invalid input!");
