
function addZero(number) {

    return String(number).padStart(2, "0");

}


function updateCountdown() {

    const now = new Date();

    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    const secondsLeft = Math.floor((midnight - now) / 1000);


    const hours = Math.floor(secondsLeft / 3600);

    const minutes = Math.floor((secondsLeft % 3600) / 60);

    const seconds = secondsLeft % 60;


    document.getElementById("hoursLeft").textContent = addZero(hours);

    document.getElementById("minutesLeft").textContent = addZero(minutes);

    document.getElementById("secondsLeft").textContent = addZero(seconds);

}

if (document.getElementById("hoursLeft")) {

    updateCountdown();

    setInterval(updateCountdown, 1000);

}