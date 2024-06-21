import Logger from "./logger.js";

let logger = new Logger('First Logger');
Logger.getLoggerCount();
logger.TIMER_START("timer 1");
logger.TIMER_START("timer 1");
logger.TIMER_START("timer 2");
logger.INFO("Program working as expected.");

setTimeout(() => {
    logger.TIMER_STOP("timer 1");
    logger.TIMER_STOP("timer 2", true);
    setTimeout(() => {
        logger.TIMER_STOP("timer 2");
        console.log("logs");
        console.log(logger.getLogs());
    }, 1000);
}, 1000);
