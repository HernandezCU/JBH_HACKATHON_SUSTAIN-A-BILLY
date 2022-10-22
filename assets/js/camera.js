const DEBUG = true;

window.onload = () => {
    //init video
    const video = document.getElementById("video");

    //ask for video perm
    navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
            facingMode: "environment"
        }
    }).then((mediaStream) => {
        //set video element source to camera stream
        video.srcObject = mediaStream;
        video.play();
    }).catch((err) => {
        console.error(err);
    });


    //init canvas
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = video.clientWidth;
    canvas.height = video.clientHeight;
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#0f0";

    //get upc text element
    const upcText = document.getElementById("upc");


    //init quagga
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: video
        },
        frequency: 30,
        decoder: {
            readers: ["upc_reader"]
        }
    }, (err) => {
        if(err) {
            console.error(err);
            return;
        }
        console.log("ready");
        Quagga.start();
    });


    //when barcode detected and processed
    Quagga.onProcessed((data) => {
        if(!data) return;

        //debug draw
        if(DEBUG) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            //draw box around boxes
            for(let box of data.boxes) {
                ctx.beginPath();
                for(let point of box) {
                    ctx.lineTo(point[0], point[1]);
                }
                ctx.closePath();
                ctx.stroke();
            }
        }

        //update upc if it exists
        if(!data.codeResult) return;
        makeRequest(data.codeResult.code);
        upcText.innerHTML = data.codeResult.code;
        video.pause();
        setTimeout(() => {
            video.play();
        }, 500);
    });
};
