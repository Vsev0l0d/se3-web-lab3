{
    window.onload = function () {
        let clock = document.getElementById("time");
        clock.innerHTML = new Date().toLocaleTimeString();
        window.setInterval(function () {
            clock.innerHTML = new Date().toLocaleTimeString();
        }, 10000);
    };
}