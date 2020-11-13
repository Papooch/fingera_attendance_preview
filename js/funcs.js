'use strict';

/**
 * Converts a time string to a proper Date object
 * 
 * @param {RegExpMatchArray} match 
 * @param {String} time time in the format of "HH:mm"
 * @return {Date}
 */
function getDateTime(match, time) {
    return new Date(`${match.year}-${getMonthNumStr(match.month)}-${match.day}T${time}Z`);
}

/**
 * Returns a percentage of the time passed from 
 * the start of the day to the end of the day
 * 
 * @param {Object} day 
 * @param {Date} time 
 */
function getTimePercentage(day, time) {
    return Math.round((time-day.dayStart)/(day.dayEnd-day.dayStart)*100)/1;
}

let dayStartHour = "06",
    dayEndHour = "21",
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
        let intervalInfo = getIntervalType(match.type);
        console.log(intervalInfo);
        let interval = {
            type: match.type,
            typeClass: intervalInfo?.class,
            isWork: intervalInfo?.work,
            startText: match.start,
            start: getDateTime(match, match.start),
            endText: match.end,
            end: getDateTime(match, match.end),
            durationText: match.duration,
        };
         if (
            Number.isNaN(interval.end.getTime()) &&
            !Number.isNaN(interval.start.getTime())
        ){
            let now = new Date() ;
            now.setTime( now.getTime() - new Date().getTimezoneOffset()*60*1000 );
            if(this.dayEnd > now){
                interval.type += " (probíhá)";
                interval.typeClass += " ongoing";
                interval.end = now;
                interval.endText = interval.end.toISOString().substr(11,5);
                interval.durationText = getDurationStringFromMinutes(Math.floor((interval.end - interval.start)/60000));
            }
        }
        interval.startPercentage = getTimePercentage(this, interval.start)
        interval.widthPercentage = getTimePercentage(this, interval.end) - interval.startPercentage;
        if(interval.isWork){
            this.workMinutes += getTotalMinutesFromDuration(interval.durationText)
        }
        this.intervals.push(interval)
    }
}

/**
 * 
 * @param {String} str 
 * @return {String}
 */
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
        "Práce": {class: "work", work: true},
        "Oběd": {class: "lunch", work: true},
        "Home Office": {class: "HO", work: true},
        "Návštěva lékaře": {class: "doctor", work: false},
    }
    return intervalLookup[
        str
            .replace("*", "")
            .replace(/\(.*\)/, "")
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
