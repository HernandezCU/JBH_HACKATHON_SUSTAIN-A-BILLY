const conts = document.getElementsByClassName("cont");

const nameEle = document.getElementById("prod-name"),
    imgEle = document.getElementById("img"),
    typeEle = document.getElementById("prod-type"),
    footprintEle = document.getElementById("footprint"),
    instructionEle = document.getElementById("instructions");

function display(json) {
    console.debug(json);
    return; //temp
    nameEle.innerHTML;
    imgEle.src;
    typeEle.innerHTML;
    footprintEle.innerHTML;
    instructionEle.innerHTML;
}

function switchTo(className) {
    for(let cont of conts) {
        cont.style.display = "none";
    }
    document.getElementsByClassName(className)[0].style.display = "block";
}
