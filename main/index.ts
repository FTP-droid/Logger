class Logger {
    private logAll;

    constructor(){
        this.logAll = true;
    }

    ERR(errMsg: string){
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
logger.INFO('Updated!');
