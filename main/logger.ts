import path from 'node:path';
import { nodeConsoleTextToCommands } from './constants.js';

type logTypes = 'error' | 'debug' | 'warn' | 'info';
type logLevel = logTypes | 'logAll' | 'none';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);

class Logger {
    private loggerName: string;
    private logLevel: logLevel;
    private globalOutputDateAndTime = false;
    private timerStarted = false;
    private timerStartValue = 0;

    private static loggers: Map<string, Logger> = new Map();

    constructor(loggerName: string){
        if(Logger.loggers.has(loggerName)){
            throw new Error(`A logger with the name: '${loggerName}' already exists.`);
        }
        Logger.loggers.set(loggerName, this);

        this.loggerName = loggerName;
        this.logLevel = 'logAll';
    }

    static getLoggerCount(){
        console.log(Logger.loggers.size);
    }

    //Get the logger name
    getLoggerName(){
        console.log(`The name of this logger is: ${this.loggerName}`)
    }
    
    //Get the current log level.
    getLogLevel(){
        console.log(`Log Level: ${this.logLevel}`);
    }
    
    //Sets which types of logs are output. If an invalid input is used with this function, it exits early while preserving the previous value of logLevel.
    setLogLevel(newLogLevel: logLevel){
        if(newLogLevel !== 'logAll'  && newLogLevel !== 'error'  && newLogLevel !== 'debug'  
            && newLogLevel !== 'warn' && newLogLevel !== 'info' && newLogLevel !== 'none'){
            console.log(`Log level not updated. INVALID INPUT: ${newLogLevel}.\n The logger will continue logging with previous log level: ${this.logLevel}`);
            return;
        }

        this.logLevel = newLogLevel;
    }

    //Get the state of globalOutputDateAndTime.
    getGlobalOutputDateAndTime(){
        console.log(this.globalOutputDateAndTime);
    }
    
    //Set the globalOutputDateAndTime variable to a new value.
    setGlobalOutputDateAndTime(newGlobalOutputDateAndTime: boolean){
        //Ensure newGlobalOutputDateAndTime is read as a boolean.
        newGlobalOutputDateAndTime = !!newGlobalOutputDateAndTime;

        this.globalOutputDateAndTime = newGlobalOutputDateAndTime;
    }

    //Log an error message. Instead of logging, you may opt to manually throw an error by setting the optional throwErr paramater to true.
    ERROR(errMsg: string, throwErr = false, outputDateAndTime = false){
        if(this.logLevel == 'none' || (this.logLevel !== 'logAll' && this.logLevel !== 'error')){
            return;
        }

        if(throwErr){
            throw new Error(errMsg);
        }

        let msg = this.globalOutputDateAndTime || outputDateAndTime? `[${new Date().toString()}] ` : "";
        msg += `${nodeConsoleTextToCommands.FgBlue}Error:${nodeConsoleTextToCommands.Reset} ${errMsg}`;

        console.log(msg);
    }

    //Log a standard debug message.
    DEBUG(dbgMsg: string, outputDateAndTime=false){
        if(this.logLevel == 'none' || (this.logLevel !== 'logAll' && this.logLevel !== 'debug')){
            return;
        }
        let msg = this.globalOutputDateAndTime || outputDateAndTime? `[${new Date().toString()}] ` : "";
        msg += `${nodeConsoleTextToCommands.FgBlue}Debug:${nodeConsoleTextToCommands.Reset} ${dbgMsg}`;

        console.log(msg);
    }

    //Log a standard warning message.
    WARN(warnMsg: string, outputDateAndTime=false){
        if(this.logLevel == 'none' || (this.logLevel !== 'logAll' && this.logLevel !== 'error')){
            return;
        }
        let msg = this.globalOutputDateAndTime || outputDateAndTime? `[${new Date().toString()}] ` : "";
        msg += `${nodeConsoleTextToCommands.FgYellow}Warning:${nodeConsoleTextToCommands.Reset} ${warnMsg}`;

        console.log(msg);
    }

    //Log a standard info message
    INFO(infoMSG: string, outputDateAndTime=false){
        if(this.logLevel == 'none' || (this.logLevel !== 'logAll' && this.logLevel !== 'info')){
            return;
        }
        let msg = this.globalOutputDateAndTime || outputDateAndTime? `[${new Date().toString()}] ` : "";
        msg += `${nodeConsoleTextToCommands.FgBlue}Info:${nodeConsoleTextToCommands.Reset} ${infoMSG}`;

        console.log(msg);
    }

    TIMER_START(timerName: string){
        if(this.timerStarted){
            this.WARN(`A timer was already started using this logger. ` +  
                `A logger can only have one timer running at a time. \nCreate a new logger if you would like to have multiple timers running across overlapping intervals.`);
            return;
        }
        
        this.timerStarted = true;
        console.log(`${nodeConsoleTextToCommands.FgGreen}Start of ${timerName}.${nodeConsoleTextToCommands.Reset}`);
        this.timerStartValue = Date.now();
    }

    TIMER_END(timerName: string){
        if(!this.timerStarted){
            this.WARN(`TIMER_END was called but no running instance of timer was found.`);
            return;
        }

        console.log(`${nodeConsoleTextToCommands.FgGreen}End of ${timerName}. \nElapsed Time: ${Date.now() - this.timerStartValue}ms.${nodeConsoleTextToCommands.Reset}`);
        this.timerStarted = false;
    }
}

export default Logger;