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
    private timers: Map<string, number> = new Map();

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

    getLoggerName(){
        console.log(`The name of this logger is: ${this.loggerName}`)
    }
    
    getLogLevel(){
        console.log(`Log Level: ${this.logLevel}`);
    }
    
    //Sets which types of logs are output. 
    //If an invalid input is used with this function, it exits early while preserving the previous value of logLevel.
    setLogLevel(newLogLevel: logLevel){
        if(newLogLevel !== 'logAll'  && newLogLevel !== 'error'  && newLogLevel !== 'debug'  
            && newLogLevel !== 'warn' && newLogLevel !== 'info' && newLogLevel !== 'none'){
            console.log(`Log level not updated. INVALID INPUT: ${newLogLevel}.\n The logger will continue logging with previous log level: ${this.logLevel}`);
            return;
        }

        this.logLevel = newLogLevel;
    }

    getGlobalOutputDateAndTime(){
        console.log(this.globalOutputDateAndTime);
    }
    
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
        
        //If globalOutputDateAndTime (object variable) or outputDataAndTime (function variable) is true, add the date and time to the final output.
        let msg = this.globalOutputDateAndTime || outputDateAndTime? `[${new Date().toString()}] ` : "";
        msg += `${nodeConsoleTextToCommands.FgBlue}Error:${nodeConsoleTextToCommands.Reset} ${errMsg}`;

        console.log(msg);
    }

    //Log a standard debug message.
    DEBUG(dbgMsg: string, outputDateAndTime=false){
        if(this.logLevel == 'none' || (this.logLevel !== 'logAll' && this.logLevel !== 'debug')){
            return;
        }

        //If globalOutputDateAndTime (object variable) or outputDataAndTime (function variable) is true, add the date and time to the final output.
        let msg = this.globalOutputDateAndTime || outputDateAndTime? `[${new Date().toString()}] ` : "";
        msg += `${nodeConsoleTextToCommands.FgBlue}Debug:${nodeConsoleTextToCommands.Reset} ${dbgMsg}`;

        console.log(msg);
    }

    //Log a standard warning message.
    WARN(warnMsg: string, outputDateAndTime=false){
        if(this.logLevel == 'none' || (this.logLevel !== 'logAll' && this.logLevel !== 'error')){
            return;
        }

        //If globalOutputDateAndTime (object variable) or outputDataAndTime (function variable) is true, add the date and time to the final output.
        let msg = this.globalOutputDateAndTime || outputDateAndTime? `[${new Date().toString()}] ` : "";
        msg += `${nodeConsoleTextToCommands.FgYellow}Warning:${nodeConsoleTextToCommands.Reset} ${warnMsg}`;

        console.log(msg);
    }

    //Log a standard info message
    INFO(infoMSG: string, outputDateAndTime=false){
        if(this.logLevel == 'none' || (this.logLevel !== 'logAll' && this.logLevel !== 'info')){
            return;
        }

        //If globalOutputDateAndTime (object variable) or outputDataAndTime (function variable) is true, add the date and time to the final output.
        let msg = this.globalOutputDateAndTime || outputDateAndTime? `[${new Date().toString()}] ` : "";
        msg += `${nodeConsoleTextToCommands.FgBlue}Info:${nodeConsoleTextToCommands.Reset} ${infoMSG}`;

        console.log(msg);
    }

    //Create a new named timer if a timer with name:'timerName' does not exist.
    TIMER_START(timerName: string){
        if(this.timers.has(timerName)){
            this.WARN(`A timer '${timerName}' already exists in '${this.loggerName}'. A new timer was not created.`);
            return;
        }
        
        console.log(`${nodeConsoleTextToCommands.FgGreen}'${timerName}' started.${nodeConsoleTextToCommands.Reset}`);
        this.timers.set(timerName, Date.now());
    }


    //Stop a timer (if it exists) by default and log the elapsed time. Or log the current elapsed time without stopping a timer (if it exists).
    TIMER_STOP(timerName: string, log = false){
        if(!this.timers.has(timerName)){
            this.WARN(`TIMER_STOP was called but a timer '${timerName}' was not found in '${this.loggerName}'.`);
            return;
        }

        const timerStart = this.timers.get(timerName) || 0;
        const timerEnd = Date.now();
        const elapsedTime = timerEnd - timerStart;

        const timerMsg = log? `'${timerName}' current elapsed time: ${elapsedTime}ms.`: `'${timerName}' stopped with elapsed time: ${elapsedTime}ms.`;

        const msg = `${nodeConsoleTextToCommands.FgGreen}${timerMsg}${nodeConsoleTextToCommands.Reset}`
        console.log(msg);

        if(log)
            return;

        this.timers.delete(timerName);
    }
}

export default Logger;