const SERVER_ADDRESS = "https://sussy.deta.dev";

function makeRequest(upc) {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", () => {
        console.debug(xhr.response);
    });
    xhr.open("GET", `${SERVER_ADDRESS}/upc_lookup/${upc}`);
    xhr.send();
}
