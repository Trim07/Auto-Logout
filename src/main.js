class TimerToLogout {

    constructor({ timeout, timeToCheck, onTimeout, showPopup, timeToShowPopup }) {

        this.timeout = timeout * 1000;
        this.timeToCheck = timeToCheck * 1000;
        this.onTimeout = onTimeout;
        this.eventHandler = this.updateTimeout.bind(this);
        this.diffBetweenTheTimes;
        this.lockShowPopupMessage = false;
        this.showPopupMessage = showPopup;
        this.timeToShowPopup = timeToShowPopup * 1000;
 
        this.tracker();
        this.startCounter();
    }

    updateTimeout() {

        if (this.timeoutTracker) {
            clearTimeout(this.timeoutTracker);
        }

        this.timeoutTracker = setTimeout(() => {
            localStorage.setItem("_timeToLogout", Date.now() + this.timeout);
        }, 300);

    }

    tracker() {
        window.addEventListener("mousemove", this.eventHandler);
        window.addEventListener("scroll", this.eventHandler);
        window.addEventListener("keydown", this.eventHandler);
    }

    popupMessage() {

        let timerInterval;
        this.lockShowPopupMessage = true;
        
        Swal.fire({
            title: `Você ainda está aí?`,
            html: `Você será desconectado em <text></text>`,
            timer: this.diffBetweenTheTimes.asMilliseconds(),
            timerProgressBar: true,
            confirmButtonText: 'Sim, estou aqui!',
            confirmButtonColor: "#268627",
            didOpen: () => {
                Swal.enableButtons()
                const text = Swal.getHtmlContainer().querySelector('text');
                timerInterval = setInterval(() => {
                    text.textContent = moment.duration(moment.duration(Swal.getTimerLeft()).asMilliseconds()).humanize();
                }, 1000)
            },
            willClose: () => {
                clearInterval(timerInterval);
                this.cleanUp();
            }
        }).then((result) => {
            if (result.dismiss === Swal.DismissReason.timer) {
                this.onTimeout();
                this.cleanUp();
            }
        });
    }

    startCounter() {
        this.updateTimeout();

        this.interval = setInterval(() => {
            this.diffBetweenTheTimes = moment.duration(moment(parseInt(localStorage.getItem("_timeToLogout"))).diff(moment(Date.now()))); // difference between _timeToLogout time and current time
            const expiredTime = parseInt(localStorage.getItem("_timeToLogout") || 0, 10);

            if(expiredTime <= moment.duration(Date.now()+this.timeToShowPopup).asMilliseconds() && this.showPopupMessage === true && this.lockShowPopupMessage === false){
                this.popupMessage()
            }
        }, this.timeToCheck);
    }

    cleanUp() {
        localStorage.removeItem("_timeToLogout");
        clearInterval(this.interval);
        window.removeEventListener("mousemove", this.eventHandler);
        window.removeEventListener("scroll", this.eventHandler);
        window.removeEventListener("keydown", this.eventHandler);
    }
}

export default TimerToLogout;