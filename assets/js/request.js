const SERVER_ADDRESS = "https://sussy.deta.dev";

function makeRequest(upc, displayFunct) {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", () => {
        displayFunct(xhr.response);
    });
    xhr.open("GET", `${SERVER_ADDRESS}/upc_lookup/${upc}`);
    xhr.send();
}
