import Logger from "./logger.js";

let logger = new Logger('First Logger');
let logger2 = new Logger('Second Logger');

console.log(Logger.getLoggers());
logger.setLogLevel('timers');
logger.TIMER_START("timer 1");

//A timer named timer 1 already exists, so this line of code will not start a new timer.
logger.TIMER_START("timer 1");

logger.TIMER_START("timer 2");
logger.DEBUG("Weird bug happens here.", false);
logger.WARN("This is a warning");
logger.ERROR("ERROR!");
logger.INFO("HELLO");

async function timer(){
    await new Promise<void> (resolve => {setTimeout(() => {
        logger.TIMER_STOP("timer 1");
        logger.TIMER_STOP("timer 2", true);
        resolve();
    }, 1000);});

    await new Promise<void> (resolve => {
        setTimeout(() => {
            logger.TIMER_STOP("timer 2");
            resolve();
        }, 1000);
    });

    console.log("LOGS");
    console.log(logger.getLogs());
    console.log("Success!");
}

timer();

