const DEBUG = false;

function capture(videoElement) {
    var canvas2 = document.createElement('canvas');
    document.body.appendChild(canvas2);     
    var video = videoElement;
    canvas2.width = video.videoWidth;
    canvas2.height = video.videoHeight;
    canvas2.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight);  
    let url = canvas2.toDataURL('image/jpeg');
    document.body.removeChild(canvas2);

    return url;
}

window.onload = () => {
    //init element vars
    var video = document.getElementById("video"),
        canvas = document.getElementById("canvas"),
        ctx = canvas.getContext("2d");
    //get upc text element
    const upcText = document.getElementById("upc");


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
        makeRequest(data.codeResult.code, display); //weird but dk
        upcText.innerHTML = data.codeResult.code;
        switchTo("info-cont");

        // post to /upc_lookup the upc and url
        fetch("http://localhost:8000/upc_lookup?upc=" + data.codeResult.code + "&url=" + url, {
                "headers": {
                    "accept": "text/html",
                    "accept-language": "en-US,en;q=0.9",
                    "cache-control": "no-cache",
                    "pragma": "no-cache",
                    "sec-ch-ua": "\"Google Chrome\";v=\"105\", \"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"105\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"macOS\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin"
                },
                "referrer": "http://localhost:8000/docs",
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": null,
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            });

        //temporarily pause after scanning
        video.pause();
        setTimeout(() => {
            video.play();
        }, 500);
    });
};
