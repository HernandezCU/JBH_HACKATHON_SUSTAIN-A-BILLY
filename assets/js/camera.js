const DEBUG = false;

function camPerms() {
    //ask for video perm
    navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
            facingMode: "environment"
        }
    }).then((mediaStream) => {
        //set video element source to camera stream
        video.srcObject = mediaStream;
        video = document.getElementsByTagName("video")[0];
        video.play();

        //init canvas (scuff)
        setTimeout(() => {
            canvas = document.getElementById("canvas");
            ctx = canvas.getContext("2d");
            canvas.width = video.clientWidth;
            canvas.height = video.clientHeight;
            ctx.lineWidth = 1;
            ctx.strokeStyle = "#0f0";
        }, 500);
    }).catch((err) => {
        console.error(err);
    });
}

window.onload = () => {
    //init element vars
    var video = document.getElementById("video"),
        canvas = document.getElementById("canvas"),
        ctx = canvas.getContext("2d");
    //get upc text element
    const upcText = document.getElementById("upc");


    camPerms();


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

        //update upc if it exists then other info
        if(!data.codeResult) return;
        makeRequest(data.codeResult.code, display); //wonk
        upcText.innerHTML = data.codeResult.code;
        switchToCont("info-cont");

        //stop scanning
        Quagga.stop();
    });
};

function retry() {
    showAllCont();
    camPerms();
    document.getElementsByTagName("video")[0].play();
    Quagga.start();
}
