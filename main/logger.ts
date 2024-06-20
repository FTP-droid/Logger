import path from 'node:path';

type logTypes = 'error' | 'debug' | 'warn' | 'info';
type logLevel = logTypes | 'logAll' | 'none';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);

class Logger {
    private logLevel: logLevel;
    private static count: number = 0;

    constructor(){
        this.logLevel = 'logAll';
        Logger.count++;
    }

    static getLoggerCount(){
        console.log(Logger.count);
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
        console.log(`Error: ${errMsg}`);
    }

    DEBUG(dbgMsg: string){
        if(this.logLevel == 'none' || (this.logLevel !== 'logAll' && this.logLevel !== 'debug')){
            return;
        }
        console.log(`Debug: ${dbgMsg}`);
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