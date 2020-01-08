function updateClock() {
    var now = new Date(),

        months = ['January', 'February', 'March', 
                'April', 'May', 'June', 
                'July', 'August', 'September', 
                'October', 'November', 'December']; 

        day = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 
                'Friday', 'Saturday', 'Sunday'];

        hours = now.getHours();
        minutes = now.getMinutes();

        twoDigitHrs = hours < 10 ? '0' + hours : hours;
        twoDigitMins = minutes < 10 ? '0' + minutes : minutes;

        time = twoDigitHrs + ':' + twoDigitMins;

        // a cleaner way than string concatenation
        date = [day[now.getDay()] + ',', months[now.getMonth()], now.getDate()].join(' ');

    // set the content of the element with the ID time to the formatted string
    document.getElementById('time').innerHTML = time;
    document.getElementById('date').innerHTML = date;
    // console.log(time, date);

    // call this function again in 1000ms
    setTimeout(updateClock, 1000);
}
updateClock(); // initial call