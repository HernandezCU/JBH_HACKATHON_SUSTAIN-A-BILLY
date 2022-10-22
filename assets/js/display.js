const conts = document.getElementsByClassName("cont");

function display(json) {
    console.debug(json);
    document.getElementById("prod-name").innerHTML = json["type"];
    document.getElementById("prod-type").innerHTML = json["material"];
    document.getElementById("footprint").innerHTML = json["footprint"];
    document.getElementById("instructions").innerHTML = json["instructions"];
}

function switchToCont(className) {
    for(let cont of conts) {
        cont.style.display = "none";
    }
    document.getElementsByClassName(className)[0].style.display = "block";
}

function showAllCont() {
    for(let cont of conts) {
        cont.style.display = "block";
    }
}
