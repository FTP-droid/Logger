type logLevel = 'logAll' | 'error' | 'debug' | 'warn' | 'info' | 'none';

class Logger {
    logLevel: logLevel;

    constructor(){
        this. logLevel = 'logAll';
    }

    getLogLevel(){
        console.log(`Log Level: ${this.logLevel}`);
    }

    setLogLevel(newLogLevel: logLevel){
        if(newLogLevel !== 'logAll'  && newLogLevel !== 'error'  && newLogLevel !== 'debug'  
            && newLogLevel !== 'warn' && newLogLevel !== 'info' && newLogLevel !== 'none'){
            console.log(`Log level not updated. INVALID INPUT: ${newLogLevel}.\n The logger will continue logging with previous logLevel ${this.logLevel}`);
            return;
        }

        this.logLevel = newLogLevel;
    }

    ERROR(errMsg: string){
        console.log(`There was an error with message: ${errMsg}`);
    }

    DEBUG(dbgMsg: string){
        console.log(`Debug message: ${dbgMsg}`);
    }

    WARN(warnMsg: string){
        console.log(`Warning: ${warnMsg}`);
    }

    INFO(infoMSG: string){
        console.log(`Info: ${infoMSG}`);
    }
}

const logger = new Logger();
logger.setLogLevel('logAll');
logger.getLogLevel();
logger.INFO('Updated!');
