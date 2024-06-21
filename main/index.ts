import Logger from "./logger.js";

let logger = new Logger('First Logger');
let logger2 = new Logger('Second Logger');
Logger.getLoggerCount();
logger.TIMER_START("timer 1");

setTimeout(() => {
    logger.TIMER_END("timer 1");
}, 1000);

logger.INFO("Invalid input!");
