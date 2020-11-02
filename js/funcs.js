'use strict';

function getDateTime(match, time) {
    return new Date(`${match.year}-${getMonthNumStr(match.month)}-${match.day}T${time}Z`);
}

function getTimePercentage(day, time) {
    return Math.round((time-day.dayStart)/(day.dayEnd-day.dayStart)*1000)/10;
}

class Day {
    constructor(match) {
        this.day = match.day;
        this.dayOfWeek = match.dayOfWeek;
        this.intervals = [];
        this.dayStart = getDateTime(match, "07:00");
        this.dayEnd = getDateTime(match, "20:00");
        this.addInterval(match);
    }

    addInterval(match) {
        let interval = {
            type: match.type,
            typeClass: getIntervalType(match.type),
            start: getDateTime(match, match.start),
            end: getDateTime(match, match.end),
            duration: match.duration
        };
        interval.startPercentage = getTimePercentage(this, interval.start)
        interval.widthPercentage = getTimePercentage(this, interval.end) - interval.startPercentage;
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