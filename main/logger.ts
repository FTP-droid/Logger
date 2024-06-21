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
    private saveLogs: boolean;
    private logs: string[] = [];

    private static loggers: Map<string, Logger> = new Map();

    constructor(loggerName: string, globalOutputDateAndTime = true, saveLogs = true){
        //Throw an error instead of warning to prevent the use of 2 loggers with identical names.
        if(Logger.loggers.has(loggerName)){
            throw new Error(`A logger with the name: '${loggerName}' already exists.`);
        }
        Logger.loggers.set(loggerName, this);

        this.loggerName = loggerName;
        this.globalOutputDateAndTime = !!globalOutputDateAndTime;
        this.saveLogs = !!saveLogs;
        this.logLevel = 'logAll';
    }

    static getLoggerCount(){
        console.log(Logger.loggers.size);
    }

    getLoggerName(){
        console.log(`The name of this logger is: ${this.loggerName}`);
    }
    
    getLogLevel(){
        console.log(`Log Level: ${this.logLevel}`);
    }
    
    //Sets which types of logs are output. 
    //If an invalid input is used with this function, it exits early while preserving the previous value of logLevel.
    setLogLevel(newLogLevel: logLevel){
        if(newLogLevel !== 'logAll'  && newLogLevel !== 'error'  && newLogLevel !== 'debug'  
            && newLogLevel !== 'warn' && newLogLevel !== 'info' && newLogLevel !== 'none'){
            console.log(`Log level not updated. INVALID INPUT: '${newLogLevel}'.\n The logger will continue logging with previous log level: '${this.logLevel}'`);
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

    getLogs(){
        if(!this.saveLogs){
            this.WARN(`Function 'getLogs' was called however the 'saveLogs' variable was set to false during the initialization of this logger. No logs are currently saved.`);
        }
        
        return this.logs;
    }

    //Log an error message. Instead of logging, you may opt to manually throw an error by setting the optional throwErr paramater to true.
    ERROR(errMsg: string, throwErr = false, outputDateAndTime = this.globalOutputDateAndTime){
        if(this.logLevel == 'none' || (this.logLevel !== 'logAll' && this.logLevel !== 'error')){
            return;
        }

        if(throwErr){
            throw new Error(errMsg);
        }
        
        //If globalOutputDateAndTime (object variable) or outputDateAndTime (function variable) is true, add the date and time to the final output.
        let msg = outputDateAndTime? `[${new Date().toLocaleString()}] ` : "";
        
        const msgForLogging = `${msg}Error: ${errMsg}`;
        msg += `${nodeConsoleTextToCommands.FgBlue}Error:${nodeConsoleTextToCommands.Reset} ${errMsg}`;

        if(this.saveLogs){
            this.logs.push(msgForLogging);
        }

        console.log(msg);
    }

    //Log a standard debug message.
    DEBUG(dbgMsg: string, outputDateAndTime=this.globalOutputDateAndTime){
        if(this.logLevel == 'none' || (this.logLevel !== 'logAll' && this.logLevel !== 'debug')){
            return;
        }

        //If globalOutputDateAndTime (object variable) or outputDateAndTime (function variable) is true, add the date and time to the final output.
        let msg = outputDateAndTime? `[${new Date().toLocaleString()}] ` : "";

        const msgForLogging = `${msg}Debug: ${dbgMsg}`;
        msg += `${nodeConsoleTextToCommands.FgBlue}Debug:${nodeConsoleTextToCommands.Reset} ${dbgMsg}`;

        if(this.saveLogs){
            this.logs.push(msgForLogging);
        }

        console.log(msg);
    }

    //Log a standard warning message.
    WARN(warnMsg: string, outputDateAndTime=this.globalOutputDateAndTime){
        if(this.logLevel == 'none' || (this.logLevel !== 'logAll' && this.logLevel !== 'error')){
            return;
        }

        //If globalOutputDateAndTime (object variable) or outputDateAndTime (function variable) is true, add the date and time to the final output.
        let msg = outputDateAndTime? `[${new Date().toLocaleString()}] ` : "";

        const msgForLogging = `${msg}Warning: ${warnMsg}`;
        msg += `${nodeConsoleTextToCommands.FgYellow}Warning:${nodeConsoleTextToCommands.Reset} ${warnMsg}`;

        if(this.saveLogs){
            this.logs.push(msgForLogging);
        }

        console.log(msg);
    }

    //Log a standard info message
    INFO(infoMSG: string, outputDateAndTime=this.globalOutputDateAndTime){
        if(this.logLevel == 'none' || (this.logLevel !== 'logAll' && this.logLevel !== 'info')){
            return;
        }

        //If globalOutputDateAndTime (object variable) or outputDateAndTime (function variable) is true, add the date and time to the final output.
        let msg = outputDateAndTime? `[${new Date().toLocaleString()}] ` : "";

        const msgForLogging = `${msg}Info: ${infoMSG}`;
        msg += `${nodeConsoleTextToCommands.FgBlue}Info:${nodeConsoleTextToCommands.Reset} ${infoMSG}`;

        if(this.saveLogs){
            this.logs.push(msgForLogging);
        }

        console.log(msg);
    }

    //Create a new named timer if a timer with the same name does not already exist.
    TIMER_START(timerName: string, outputDateAndTime=this.globalOutputDateAndTime){
        if(this.timers.has(timerName)){
            this.WARN(`A timer ${timerName} already exists in ${this.loggerName}. A new timer was not created.`);
            return;
        }
        
        let msg = outputDateAndTime? `[${new Date().toLocaleString()}] ` : "";
        const msgForLogging = msg + `${timerName} started.`;
        
        msg += `${nodeConsoleTextToCommands.FgGreen}${timerName}${nodeConsoleTextToCommands.Reset}: started.`;
        
        console.log(msg);
        if(this.saveLogs){
            this.logs.push(msgForLogging);
        }

        this.timers.set(timerName, Date.now());
    }


    //Stop a timer (if it exists) by default and log the elapsed time. Or log the current elapsed time without stopping a timer (if it exists).
    TIMER_STOP(timerName: string, log = false, outputDateAndTime = this.globalOutputDateAndTime){
        if(!this.timers.has(timerName)){
            this.WARN(`TIMER_STOP was called but a timer '${timerName}' was not found in '${this.loggerName}'.`);
            return;
        }

        const timerStart = this.timers.get(timerName) || 0;
        const timerEnd = Date.now();
        const elapsedTime = timerEnd - timerStart;

        let dateMsg = outputDateAndTime? `[${new Date().toLocaleString()}] ` : "";
        let timerMsg = log? `current elapsed time is ${elapsedTime}ms.`: `stopped with elapsed time ${elapsedTime}ms.`;
        
        const msgForLogging = `${dateMsg}${timerMsg}`;
        const msg = `${dateMsg}${nodeConsoleTextToCommands.FgGreen}${timerName}${nodeConsoleTextToCommands.Reset}: ${timerMsg}`
        
        console.log(msg);

        if(this.saveLogs){
            this.logs.push(msgForLogging);
        }

        if(log)
            return;

        this.timers.delete(timerName);
    }
}

export default Logger;