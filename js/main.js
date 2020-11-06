'use strict';

let container = document.getElementById('container');
let fileInput = document.getElementById('file-input');
let fileDrop = document.getElementById('file-drop');
let fileChoose = document.getElementById('file-choose');

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
        displayAttendance(getMatchesFromCSV(this.result), container);
        console.log(this.result);
    }
    reader.readAsText(csv, "windows-1250");
}

