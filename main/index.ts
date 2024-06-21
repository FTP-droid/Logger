import Logger from "./logger.js";

let logger = new Logger('First Logger', true);
Logger.getLoggerCount();
logger.TIMER_START("timer 1");
logger.TIMER_START("timer 1");
logger.TIMER_START("timer 2");
logger.INFO("Program working as expected.", false);

async function timer(){
    await new Promise<void> (resolve => {setTimeout(() => {
        logger.TIMER_STOP("timer 1");
        logger.TIMER_STOP("timer 2", true);
        resolve();
    }, 1000);});

    await new Promise<void> (resolve => {
        setTimeout(() => {
            logger.TIMER_STOP("timer 2");
        }, 1000);
        resolve();
    });

    console.log("LOGS");
    console.log(logger.getLogs());
    console.log("Success!");
}

timer();

