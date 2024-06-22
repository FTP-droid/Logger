import Logger from "./logger.js";

let logger = new Logger('First Logger');
let logger2 = new Logger('Second Logger');

console.log(Logger.getLoggers());
logger.TIMER_START("timer 1");

//A timer named timer 1 already exists, so this line of code will not start a new timer.
logger.TIMER_START("timer 1");

logger.TIMER_START("timer 2");

if(0.1 + 0.2 !== 0.3){
    logger.DEBUG("Weird math bug happens here.", false);
}

logger.WARN("Do not log excessively!");

//Log an error here.
const a = 1, b = 0;
function divide(a: number, b: number){
    if(b === 0){
        logger.ERROR('Denominator is equal to 0!');
        return;
    }

    return a / b;
}

console.log(divide(a, b));

//Simple informative message
logger.INFO("The application is working as expected.");

//An example to log or stop the timers previously started.
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
    logger.INFO("Success!");
}

timer();

