'use strict';

let container = document.getElementById('container');
let fileInput = document.getElementById('file-input');
let fileDrop = document.getElementById('file-drop');
let fileChoose = document.getElementById('file-choose');

var appTemplate = Handlebars.compile(document.getElementById("app-template").innerHTML);


fileChoose.onclick = ()=>{
    fileInput.click();
}

fileInput.onchange = function (e) {
    let file = this.files[0];
    readAndDisplayCSV(file);
}

fileDrop.ondragover = function(e){
    this.classList = "dragover";
    e.preventDefault();
}
fileDrop.ondragleave = function(e){
    this.classList = "";
    e.preventDefault();
}
fileDrop.ondrop = e=>{
    e.preventDefault();
    let file = e.dataTransfer.files[0];
    readAndDisplayCSV(file);
}

function readAndDisplayCSV(csv){
    let reader = new FileReader();
    reader.onload = function (e) {
        displayAttendance(getMatchesFromCSV(this.result));
        console.log(this.result);
    }
    reader.readAsText(csv, "windows-1250");
}




function displayAttendance(matches) {
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

