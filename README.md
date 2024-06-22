# Logger

Logger is a lightweight easy to set up package that enables you, the developer, to log your code quickly and efficiently with as little hassle as possible.

## Using the logger in the included index.ts file
```javascript
//To start the project in dev mode
npm run dev

//To start the project in production mode. 
//This script will generate js files for each of the ts files in this application to be used for production.
npm run start

```

## Methods

### Create a logger with a logger name
```javascript
import Logger from 'logger.js';

const logger = new Logger('First Logger');

//Console log the logger's name
logger.getLoggerName();

//If you prefer not having the date and time recorded on each log, set the second parameter to false.
//This option can be changed on a log to log basis if desired (explained further down in the documentation).
const logger2 = new Logger('Second Logger', false);

//If you prefer not having your logs saved in the logger object for retrieval later.
//Note that the third paramater will set whether you want your logs to be saved.
//There is more information on this option further down in the documentation.
const logger3 = new Logger('Third Logger', true, false);
```

### Get all the loggers in use
If you would like to easily access any of the loggers you have created. You can use the static method getLoggers which will output all of the loggers currently in use.
```javascript
const logger1 = new Logger('logger 1');
const logger2 = new Logger('logger 2');

//Console logs a returned map with keys equaling a logger's name and values equaling the 'this' instance of a logger.
console.log(Logger.getLoggers());
```

### Log messages
```javascript
const logger = new Logger('Logging logger');

//Log an error
logger.ERROR("There was an error!");

//If you would like to manually throw an error to stop your program.
logger.ERROR("Fatal Error!", true);

//Log a warning
logger.WARN("Use lowercase text when possible.");

//Log a message for debugging
logger.DEBUG("This sentence should not be output.");

//Log an informative message
logger.INFO("The application is working as expected.");
```

### Local and global outputDateAndTime
By default, the global variable outputDateAndTime for a logger is set to true. This means a logger will always include the date a time a log was made.

Suppose you do not want to include the date and time for a particular log, when you globally set all logs to show the date and time a log occured or vice versa.
In this case, you can simply override the globally set date and time variable locally with the last parameter in the UPPERCASE method you are logging with. As an example:

```javascript
//Creates a logger that outputs the date and time for each log by default.
const logger = new Logger('Logger logs no date and time');

//This log will not include the date and time with the message content since it utilized the local outputDateAndTime parameter to override
// the default (or globally) set outputDateAndTime variable.
logger.WARN("This warning must show the date and time it occured", false);
```

If you would like to get or set the global outputDateAndTime of a logger, you can use the getter and setter methods for the globalOutputDateAndTime variable.

```javascript
const logger = new Logger('Logger');

//Console logs whether the date and time will be added to each log by default. The default is true.
logger.getGlobalOutputDateAndTime();

//Sets the globalDateAndTime variable to false for this logger.
logger.setGlobalOutputDateAndTime(false);
```

### Save your logs
Each logger saves all logs by default to an array variable you can access with the getLogs method.
Perhaps you have some memory constraints in your application. In that case, you can disable saving your logs easily when creating a logger.
```javascript
const logger = new Logger('This logger saves all its logs by default');
logger.INFO("This is the first log of this logger.");

//Console log the array of logs of this logger. The array in this logger will contain one log.
console.log(logger.getLogs());

//Note that the third paramater is set to false. Consequently logs will not be saved to the logger.
const logger2 = new Logger('This logger will not save its logs', true, false);

logger2.INFO("This is the first log of this logger.");

//Returns an empty array as logs are not saved in this logger.
console.log(logger2.getLogs());
```
*Note that the logs are saved to the logger's logs array by calling the addLog method on a log (assuming the saveLogs variable is set to true). 
There are plans to allow you the developer to overwrite this method in the future if you would like to save the logs somewhere else.*

### Get or set the logLevel of your logger
Loggers by default outputs every log available. You can choose to output only one type of log by changing the logLevel.
Do note that if you choose to not output certain logs, and you have the saveLogs option enabled, the logs that you do not output are also not saved in
the logger's logs array.

```javascript
const logger = new Logger('Logging logger');

//Console logs the logLevel variable. Outputs 'logAll' (along with some text) which is the default option.
logger.getlogLevel();

//Only log timers
logger.setLogLevel('timers');
```

### Create a timer for measuring the time of running a block of code
If you want to consistenly measure how long it takes to run a block of code, the TIMER methods are sutible for your use case.
Simple use the TIMER_START method to start the timer (and provide a timer name for your timer). Then use the TIMER_STOP method
to log the current elapsed time of your timer, and stop the timer or continue the timer with the log parameter in the TIMER_STOP method.

```javascript
const logger = new Logger('Logger for timers');

//Start the timers
logger.TIMER_START('timer 1');
logger.TIMER_START('timer 2');

async function timer(){
    await new Promise<void> (resolve => {setTimeout(() => {
        //Stops the timer after 1000ms.
        //The elapsed time is output, it may not be 100% accurate but it is a great estimate.
        logger.TIMER_STOP("timer 1");

        //If you want to check the current elapsed time without stopping a timer, set the 'log' parameter to true;
        logger.TIMER_STOP('timer 2', true);

        resolve();
    }, 1000);});

    await new Promise<void> (resolve => {setTimeout(() => {
        //Stop the second timer after ~2000ms;
        logger.TIMER_STOP('timer 2');

        resolve();
    }, 1000);});
}

timer();

```

*Note that you may encounter unexpected results if you try to start or stop a timer when the logLevel is currently set to to a level that does not include timers, since this logLevel
enables the TIMER functions to exit early and not set/unset any timer. 
Therefore, it is not recommended to change the log level from a logLevel that allows timers to a logLevel that doesn't allow timers or vice versa, in between the usage of a timer.*

## Sources
For help on initalizing a typescript project: https://www.howtographql.com/typescript-helix/1-project-setup/

For determining how to change the color of text in a node.js console application: 
https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color.
The colors for this application are implemented using the accepted answer in the previous thread.

## Design Choices

I chose to implement the Logger class using a javascript class. This enabled me to efficiently organize methods and variables in a timely manner. 

The 4 main methods I chose to implement first were the WARN, ERROR, DEBUG and INFO methods. These methods are in my opinion, integral to any logger class 
as they cover a wide array of use cases. The timer methods in the Logger class was something I chose to implement later as a bonus.

In general, there were a lot of cases where I could have enhanced the customizability of the application for the user. Instead, I opted to make a lot of the design
choices based on my own preferences to keep it simple for the user. Though there are some methods in this application that enable custom options.

I additionally chose to include an 'addLog' method that a developer can override in the future (with a few code tweaks)
to add a log in a location other than the logger object from which it was called from.

Given the time constraint and the non-requirement of a testing suite. I did not include a library for testing each method in my Logger class. I typically always include some form
of testing for any application I build to ensure consistency of application I am building.

I used guard clauses often in the methods of the Logger class to ensure a method returns early if certain conditions are not met. 
These guard clauses enhanced the readability of my application in my opinion, though some may disagree.

