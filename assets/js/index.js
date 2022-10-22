const SERVER_ADDRESS = "https://sussy.deta.dev";

var xhr = new XMLHttpRequest();
xhr.addEventListener("load", () => {
    console.log(xhr.response);
});
let upc = "hello521";
xhr.open("GET", `${SERVER_ADDRESS}/upc_lookup/${upc}`);
xhr.send();
