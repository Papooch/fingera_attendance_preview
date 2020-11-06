'use strict';

function getDateTime(match, time) {
    return new Date(`${match.year}-${getMonthNumStr(match.month)}-${match.day}T${time}Z`);
}

function getTimePercentage(day, time) {
    return Math.round((time-day.dayStart)/(day.dayEnd-day.dayStart)*1000)/10;
}

let dayStartHour = "06",
    dayEndHour = "20",
    dayStartTime = dayStartHour + ":00",
    dayEndTime = dayEndHour + ":00";

class Day {
    constructor(match) {
        this.day = match.day;
        this.dayOfWeek = match.dayOfWeek;
        this.intervals = [];
        this.dayStart = getDateTime(match, dayStartTime);
        this.dayEnd = getDateTime(match, dayEndTime);
        this.workMinutes = 0;
        this.monthText = match.month;
        this.addInterval(match);
    }

    addInterval(match) {
        let interval = {
            type: match.type,
            typeClass: getIntervalType(match.type),
            startText: match.start,
            start: getDateTime(match, match.start),
            endText: match.end,
            end: getDateTime(match, match.end),
            durationText: match.duration,
        };
        interval.startPercentage = getTimePercentage(this, interval.start)
        interval.widthPercentage = getTimePercentage(this, interval.end) - interval.startPercentage;
        this.workMinutes += getTotalMinutesFromDuration(match.duration)
        this.intervals.push(interval)
    }
}

function getMonthNumStr(str) {
    let monthsLokup = {
        "Leden": "01",
        "Únor": "02",
        "Březen": "03",
        "Duben": "04",
        "Květen": "05",
        "Červen": "06",
        "Červenec": "07",
        "Srpen": "08",
        "Září": "09",
        "Říjen": "10",
        "Listopad": "11",
        "Prosinec": "12",
    }    
    return monthsLokup[str];
}

function isWeekend(str){
    let isWeekendLookup = {
        "Pondělí": false,
        "Úterý": false,
        "Středa": false,
        "Čtvrtek": false,
        "Pátek": false,
        "Sobota": true,
        "Neděle": true,
    }
    return isWeekendLookup[str];
}

function getIntervalType(str){
    let intervalLookup = {
        "Oběd": "lunch",
        "Práce": "work",
        "Home Office": "HO",
    }
    return intervalLookup[
        str
            .replace("*", "")
            .replace("(automatický)", "")
            .trim(" ")
    ];
}


function getTotalMinutesFromDuration(str){
    let groups = str.match(/(?<negative>-?)(?<hours>[^h]+)h\ ?(?<minutes>[^m]*)(?:min)?/)?.groups;
    if (!groups) return 0;

    let minutes = (Number.parseInt(groups.hours) * 60
        + (Number.parseInt(groups.minutes) || 0));
    if (groups.negative) {
        minutes *= -1;
    }
    return minutes;
}

function getDurationStringFromMinutes(min){
    let negative = false;
    if(min < 0) {
        min *= -1;
        negative = true;
    }
    let totalHours = Math.floor(min/60);
    let minutes = min - totalHours * 60;
    let str = totalHours + "h " + minutes + "min";
    if (negative) str = "-" + str;
    return str;
}

Handlebars.registerHelper('hasIntervals', function () {
    return this.intervals[0].type !== "-";
})

Handlebars.registerHelper('readableTime', function (datetime) {
    let d = '-';
    try {
        d = datetime.toISOString().substr(11,5);
    } catch {}
    return d;
})

Handlebars.registerHelper('isWeekend', function () {
    return isWeekend(this.dayOfWeek);
})

Handlebars.registerHelper('hoursMins', function (mins) {
    if (!mins) return "-";
    return getDurationStringFromMinutes(mins);
})

function displayAttendance(matches, container) {
    let days = [];
    for (let match of matches) {
        let index = Number.parseInt(match.day)
        if (!days[index]) {
            days[index] = new Day(match);
        } else {
            days[index].addInterval(match);
        }
    }
    console.log(days);

    let totalMinutes = 0;
    for (let day of days) {
        totalMinutes += day?.workMinutes || 0;
    }

    let intervalHeaders = [];
    for (let h = Number.parseInt(dayStartHour); h < Number.parseInt(dayEndHour); h++) {
        intervalHeaders.push({ hour: h })
    }

    container.innerHTML = appTemplate({ month: days[10].monthText, days, intervalHeaders, totalMinutes });
}
