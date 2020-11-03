'use strict';

let attendanceLines = attendanceTxt.split(/\r?\n/);
let rgx = /(?<day>^\d\d). (?<month>[^\ ]+) (?<year>[^\ ]+) \[(?<dayOfWeek>[^\]]+)\];(?<type>[^;]+);(?:[^;]+);(?<start>[^;]+);(?:[^;]+);(?<end>[^;\ ]+).*;(?<duration>[^;]+)/

let matches = [];
for (let line of attendanceLines) {
    let match = line.match(rgx);
    if (match) {
        matches.push(match.groups);
    }
}

let days = [];
for (let match of matches) {
    let index = Number.parseInt(match.day)
    if (!days[index]) {
        days[index] = new Day(match);
    } else {
        days[index].addInterval(match);
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
container.innerHTML = appTemplate({month: days[10].monthText, days, intervalHeaders, totalMinutes});

