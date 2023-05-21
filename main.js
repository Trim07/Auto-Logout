import TimerToLogout from "./src/main.js";

const timerToLogout = new TimerToLogout({
    timeout: 60*3*1, // seconds, in this case was used 1 hour
    timeToCheck: 2, // seconds
    showPopup: true,
    timeToShowPopup: 60*2*1,
    
    onTimeout: () => {
        // your code here 
        window.location.replace("http://stackoverflow.com");
    },
});
