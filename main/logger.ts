import path from 'node:path';

type logLevel = 'logAll' | 'error' | 'debug' | 'warn' | 'info' | 'none';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);

class Logger {
    logLevel: logLevel;
    verbose: boolean;

    constructor(){
        this.logLevel = 'logAll';
        this.verbose = false;
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

    getVerbose(){
        console.log(this.verbose);
    }

    setVerbose(newVerbose: boolean){
        this.verbose = newVerbose;
    }

    ERROR(errMsg: string){
        if(this.logLevel == 'none' || (this.logLevel !== 'logAll' && this.logLevel !== 'error')){
            return;
        }
        console.log(`Error: ${errMsg}`);
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

export default Logger;