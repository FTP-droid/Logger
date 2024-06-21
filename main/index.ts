import Logger from "./logger.js";

let logger = new Logger('First Logger');
let logger2 = new Logger('Second Logger');
Logger.getLoggerCount();
logger.TIMER_START("timer 1");
logger.TIMER_START("timer 1");
logger.TIMER_START("timer 2");
logger2.TIMER_START("timer 2");

setTimeout(() => {
    logger.TIMER_STOP("timer 1");
    logger.TIMER_STOP("timer 2", true);
    setTimeout(() => {
        logger2.TIMER_STOP("timer 2");
        logger.TIMER_STOP("timer 2");
    }, 1000);
}, 1000);


logger.INFO("Invalid input!");
