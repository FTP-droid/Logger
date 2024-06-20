type logLevel = 'logAll' | 'error' | 'debug' | 'warn' | 'info' | 'none';

class Logger {
    logLevel: logLevel;

    constructor(){
        this.logLevel = 'logAll';
    }

    getLogLevel(){
        console.log(`Log Level: ${this.logLevel}`);
    }

    setLogLevel(newLogLevel: logLevel){
        if(newLogLevel !== 'logAll'  && newLogLevel !== 'error'  && newLogLevel !== 'debug'  
            && newLogLevel !== 'warn' && newLogLevel !== 'info' && newLogLevel !== 'none'){
            console.log(`Log level not updated. INVALID INPUT: ${newLogLevel}.\n The logger will continue logging with previous log evel: ${this.logLevel}`);
            return;
        }

        this.logLevel = newLogLevel;
    }

    ERROR(errMsg: string){
        if(this.logLevel == 'none' || (this.logLevel !== 'logAll' && this.logLevel !== 'error')){
            return;
        }
        console.log(`There was an error with message: ${errMsg}`);
    }

    DEBUG(dbgMsg: string){
        if(this.logLevel == 'none' || (this.logLevel !== 'logAll' && this.logLevel !== 'debug')){
            return;
        }
        console.log(`Debug message: ${dbgMsg}`);
    }

    WARN(warnMsg: string){
        if(this.logLevel == 'none' || (this.logLevel !== 'logAll' && this.logLevel !== 'error')){
            return;
        }
        console.log(`Warning: ${warnMsg}`);
    }

    INFO(infoMSG: string){
        if(this.logLevel == 'none' || (this.logLevel !== 'logAll' && this.logLevel !== 'info')){
            return;
        }
        console.log(`Info: ${infoMSG}`);
    }
}

const logger = new Logger();
logger.getLogLevel();
logger.INFO('Updated!');
