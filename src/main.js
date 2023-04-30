
class TimerToLogout {

    constructor ({timeout, timeToCheck, onTimeout}){
        this.timeout = timeout * 1000;
        this.timeToCheck = timeToCheck * 1000;
        this.onTimeout = onTimeout;
        this.eventHandler = this.updateTimeout.bind(this);

        this.tracker();
        this.startCounter();
    }

    updateTimeout(){

        if(this.timeoutTracker){
            clearTimeout(this.timeoutTracker);
        }

        this.timeoutTracker = setTimeout(() => {
            localStorage.setItem("_timeToLogout", Date.now() + this.timeout);
        }, 300);

    }

    tracker(){
        window.addEventListener("mousemove", this.eventHandler);
        window.addEventListener("scroll", this.eventHandler);
        window.addEventListener("keydown", this.eventHandler);
    }

    startCounter(){
        this.updateTimeout();

        this.interval = setInterval(() => {
            const expiredTime = parseInt(localStorage.getItem("_timeToLogout") || 0, 10);
            
            if(expiredTime < Date.now()){
                this.cleanUp();
                this.onTimeout();
            }
        }, this.timeToCheck);
    }

    cleanUp(){
        localStorage.removeItem("_timeToLogout");
        clearInterval(this.interval);
        window.removeEventListener("mousemove", this.eventHandler);
        window.removeEventListener("scroll", this.eventHandler);
        window.removeEventListener("keydown", this.eventHandler);
    }
}
