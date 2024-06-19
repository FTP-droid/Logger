class Logger {
    logAll;
    constructor(){
        this.logAll = true;
    }

    static ERR(errMsg: string){
        console.log(errMsg);
    }

    static DEBUG(dbgMsg: string){
        console.log(dbgMsg);
    }


}

Logger.ERR("There was an error!");