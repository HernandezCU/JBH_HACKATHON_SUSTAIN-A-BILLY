const video = document.getElementById("camera-display");

//ask for video perm
navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
        width: 1280,
        height: 640
    }
}).then((mediaStream) => {
    //set video element source to camera stream
    video.srcObject = mediaStream;
    video.play();
}).catch((err) => {
    console.error(err);
});


//init quagga
Quagga.init({
    inputStream: {
        name: "Live",
        type: "LiveStream",
        target: video
    },
    decoder: {
        readers: ["code_128_reader"]
    }
}, (err) => {
    if(err) {
        console.error(err);
        return;
    }
    console.log("ready");
    Quagga.start();
});


//init canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = video.clientWidth;
canvas.height = video.clientHeight;


ctx.lineWidth = 1;
ctx.strokeStyle = "#0f0";
Quagga.onProcessed((data) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if(!data) return;

    //draw box around boxes
    for(let box of data.boxes) {
        ctx.beginPath();
        for(let point of box) {
            ctx.lineTo(point[0], point[1] - 55);
            //~ make 55 calc
        }
        ctx.closePath();
        ctx.stroke();
    }

    if(!data.codeResult) return;
    console.log("coderesult", data.codeResult.code);
});
