const SERVER_ADDRESS = "https://sussy.deta.dev";

function makeRequest(upc, displayFunct) {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", () => {
        const obj = JSON.parse(xhr.response);
        console.debug(obj);
        displayFunct(obj);
    });
    xhr.open("GET", `${SERVER_ADDRESS}/upc_lookup/${upc}`);
    xhr.send();
}
