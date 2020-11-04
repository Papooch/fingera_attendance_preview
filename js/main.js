'use strict';

let matches = getMatchesFromCSV(attendanceCSV);
let matches2 = getMatchesFromHTML(attendanceHTML);

let days = [];
for (let match of matches) {
    let index = Number.parseInt(match.day)
    if (!days[index]) {
        days[index] = new Day(match);
    } else {
        days[index].addInterval(match);
    }
}


let days2 = [];
for (let match of matches2) {
    let index = Number.parseInt(match.day)
    if (!days2[index]) {
        days2[index] = new Day(match);
    } else {
        days2[index].addInterval(match);
    }
}


let totalMinutes = 0;
for (let day of days) {
    totalMinutes += day?.workMinutes || 0;
}

let intervalHeaders = [];
for (let h = Number.parseInt(dayStartHour); h < Number.parseInt(dayEndHour); h++ ){
    intervalHeaders.push({ hour: h })
}


let container = document.getElementById('container');
var appTemplate = Handlebars.compile(document.getElementById("app-template").innerHTML);
container.innerHTML = appTemplate({month: days2[10].monthText, days, intervalHeaders, totalMinutes});

