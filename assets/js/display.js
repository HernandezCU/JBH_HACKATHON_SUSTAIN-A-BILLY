const conts = document.getElementsByClassName("cont");

function switchTo(className) {
    for(let cont of conts) {
        cont.style.display = "none";
    }
    document.getElementsByClassName(className)[0].style.display = "block";
}
