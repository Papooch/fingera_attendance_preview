
let attendanceLines = attendanceTxt.split(/\r?\n/);
let rgx = /(?<day>^\d\d). (?<month>[^\ ]+) (?<year>[^\ ]+) \[(?<dayOfWeek>[^\]]+)\];(?<type>[^;]+);(?:[^;]+);(?<start>[^;]+);(?:[^;]+);(?<end>[^;]+);(?<duration>[^;]+)$/

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