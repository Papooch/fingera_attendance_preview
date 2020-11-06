console.log("working");

function isPreviewTableOpen() {
    return !!document.getElementById("preview");
}

if (isPreviewTableOpen()) {
    let links = document.querySelector("ul[data-js-module='links']");

    let button = document.createElement("a");
    button.textContent = "Zobrazit přehledně"

    let li = document.createElement("li");
    li.append(button);
    links.append(li);

    button.onclick = injectAndDisplayApp;
}


function createAppContainer(){
    let overlay = document.createElement("div");
    overlay.style.position = "absolute";
    overlay.style.height = "100%";
    overlay.style.width = "100%";
    overlay.style.top = "0";
    overlay.style.left = "0";
    document.body.append(overlay);

    let container = document.createElement("div");
    container.id = "container";
    container.style.position = "relative";
    container.style.top = "-1000px";
    container.style.transition = ".2s ease-in-out";
    overlay.style.transition = ".2s ease-in-out";
    overlay.append(container);

    setTimeout(()=>{
        container.style.top = "2em";
        overlay.style.backgroundColor = "rgba(0,0,0,.5)";
    }, 0)

    return container;
}

function injectAndDisplayApp(){
    console.log("displaying app");
    let html = document.body.innerHTML;
    let container = createAppContainer();
    let matches = getMatchesFromHTML(html);
    displayAttendance(matches, container);
}
