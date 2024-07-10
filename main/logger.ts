import { nodeConsoleTextToCommands } from './constants.js';

type logTypes = 'error' | 'debug' | 'warn' | 'info' | 'timers';
type logLevel = logTypes | 'logAll' | 'none';

class Logger {
    private loggerName: string;
    private logLevel: logLevel;
    private globalOutputDateAndTime = false;
    private timers: Map<string, number> = new Map();
    private saveLogs: boolean;
    private logs: string[] = [];

    private static loggers: Map<string, Logger> = new Map();

    constructor(loggerName: string, globalOutputDateAndTime = true, saveLogs = true){
        //Throw an error instead of a warning to prevent the use of 2 loggers with identical names.
        if(Logger.loggers.has(loggerName)){
            throw new Error(`A logger with the name: '${loggerName}' already exists.`);
        }
        Logger.loggers.set(loggerName, this);

        this.loggerName = loggerName;
        this.globalOutputDateAndTime = !!globalOutputDateAndTime;
        this.saveLogs = !!saveLogs;
        this.logLevel = 'logAll';
    }

    static getLoggers(){
        return Logger.loggers;
    }

    getLoggerName(){
        return this.loggerName;
    }
    
    getLogLevel(){
        return this.logLevel;
    }

    //Sets which types of logs are output. 
    //If an invalid input is used with this function, it exits early while preserving the previous value of logLevel.
    setLogLevel(newLogLevel: logLevel){
        if(newLogLevel !== 'logAll'  && newLogLevel !== 'error'  && newLogLevel !== 'debug'  
            && newLogLevel !== 'warn' && newLogLevel !== 'info' && newLogLevel !== 'none' && newLogLevel !== 'timers'){
            console.log(`Log level not updated. INVALID INPUT: '${newLogLevel}'.\n The logger will continue logging with previous log level: '${this.logLevel}'`);
            return;
        }

        this.logLevel = newLogLevel;
    }

    //Adds a log to the logs array in this logger class.
    addLog(msg: string){
        this.logs.push(msg);
    }

    //Return an array of the saved logs. Note that if saveLogs was set to false in the constructor, am empty array is returned.
    getLogs(){   
        return this.logs;
    }

    getGlobalOutputDateAndTime(){
        return this.globalOutputDateAndTime;
    }
    
    setGlobalOutputDateAndTime(newGlobalOutputDateAndTime: boolean){
        newGlobalOutputDateAndTime = !!newGlobalOutputDateAndTime;
        this.globalOutputDateAndTime = newGlobalOutputDateAndTime;
    }

    private createMessage(msg: string, outputDateAndTime = this.globalOutputDateAndTime, logType: logTypes){
        
        let dateMsg = outputDateAndTime? `[${new Date().toLocaleString()}] ` : "";
        
        let colour = '';
        let typeOfLog = '';

        switch(logType){
            case 'error':
                colour = nodeConsoleTextToCommands.FgRed;
                typeOfLog = 'Error:';
                break;
            case 'debug':
                colour = nodeConsoleTextToCommands.FgBlue;
                typeOfLog = 'Debug:';
                break;
            case 'warn':
                colour = nodeConsoleTextToCommands.FgYellow;
                typeOfLog = 'Warning:';
                break;
            case 'info':
                colour = nodeConsoleTextToCommands.FgMagenta;
                typeOfLog = 'Info:';
                break;
        }

        if(colour.length === 0){
            return 'Invalid log type selected for the private function createMessage. Hint: You cannot create a timer message with this function';
        }

        const msgForLogging = `${dateMsg}${typeOfLog} ${msg}`;
        const msgForOutput = `${dateMsg}${colour}${typeOfLog}${nodeConsoleTextToCommands.Reset} ${msg}`;

        if(this.saveLogs){
            this.addLog(msgForLogging);
        }

        return msgForOutput;
    }

    //Log an error message. Instead of logging, you may opt to manually throw an error by setting the optional throwErr paramater to true.
    ERROR(errMsg: string, throwErr = false, outputDateAndTime = this.globalOutputDateAndTime){
        if(this.logLevel == 'none' || (this.logLevel !== 'logAll' && this.logLevel !== 'error')){
            return;
        }

        if(throwErr){
            throw new Error(errMsg);
        }

        let msgForOutput = this.createMessage(errMsg, outputDateAndTime, 'error');
        console.log(msgForOutput);
    }

    //Log a standard debug message.
    DEBUG(dbgMsg: string, outputDateAndTime=this.globalOutputDateAndTime){
        if(this.logLevel == 'none' || (this.logLevel !== 'logAll' && this.logLevel !== 'debug')){
            return;
        }

        let msgForOutput = this.createMessage(dbgMsg, outputDateAndTime, 'debug');

        console.log(msgForOutput);
    }

    //Log a standard warning message.
    WARN(warnMsg: string, outputDateAndTime=this.globalOutputDateAndTime){
        if(this.logLevel == 'none' || (this.logLevel !== 'logAll' && this.logLevel !== 'warn')){
            return;
        }

        let msgForOutput = this.createMessage(warnMsg, outputDateAndTime, 'warn');

        console.log(msgForOutput);
    }

    //Log a standard info message.
    INFO(infoMsg: string, outputDateAndTime=this.globalOutputDateAndTime){
        if(this.logLevel == 'none' || (this.logLevel !== 'logAll' && this.logLevel !== 'info')){
            return;
        }

        let msgForOutput = this.createMessage(infoMsg, outputDateAndTime, 'info');

        console.log(msgForOutput);
    }

    //Create a new named timer if a timer with the same name does not already exist.
    TIMER_START(timerName: string, outputDateAndTime=this.globalOutputDateAndTime){
        if(this.logLevel == 'none' || (this.logLevel !== 'logAll' && this.logLevel !== 'timers')){
            return;
        }
        
        if(this.timers.has(timerName)){
            console.log(`A timer '${timerName}' already exists in '${this.loggerName}'. A new timer was not created.`);
            return;
        }
        
        let msg = outputDateAndTime? `[${new Date().toLocaleString()}] ` : "";
        const msgForLogging = msg + `${timerName}: Started.`;
        
        msg += `${nodeConsoleTextToCommands.FgGreen}${timerName}${nodeConsoleTextToCommands.Reset}: Started.`;
        
        console.log(msg);
        if(this.saveLogs){
            this.addLog(msgForLogging);
        }

        this.timers.set(timerName, Date.now());
    }


    //Stop a timer (if it exists) by default and log the elapsed time. Or log the current elapsed time without stopping a timer (if it exists).
    TIMER_STOP(timerName: string, log = false, outputDateAndTime = this.globalOutputDateAndTime){
        if(this.logLevel == 'none' || (this.logLevel !== 'logAll' && this.logLevel !== 'timers')){
            return;
        }
        
        if(!this.timers.has(timerName)){
            console.log(`TIMER_STOP was called but a timer '${timerName}' was not found in '${this.loggerName}'.`);
            return;
        }

        const timerStart = this.timers.get(timerName) || 0;
        const timerEnd = Date.now();
        const elapsedTime = timerEnd - timerStart;

        let dateMsg = outputDateAndTime? `[${new Date().toLocaleString()}] ` : "";
        let timerMsg = log? `Current elapsed time is ${elapsedTime}ms.`: `Stopped with elapsed time ${elapsedTime}ms.`;
        
        const msgForLogging = `${dateMsg}${timerName}: ${timerMsg}`;
        const msg = `${dateMsg}${nodeConsoleTextToCommands.FgGreen}${timerName}${nodeConsoleTextToCommands.Reset}: ${timerMsg}`
        
        console.log(msg);

        if(this.saveLogs){
            this.addLog(msgForLogging);
        }

        if(log)
            return;

        this.timers.delete(timerName);
    }
}

export default Logger;