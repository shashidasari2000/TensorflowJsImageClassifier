// Defining Variables
const webcamElement = document.getElementById('webcam');
let net;
var webcamrunning = false; // Flag, indicates if webcam-prediction is running or not
var bw = document.getElementById('butwebcam')
var bi = document.getElementById('butimage')


// App that predicts image
async function app() {
  console.log('Loading mobilenet..');

  // Check if model loaded, if not, load it.
    if (net == undefined)
        {bi.innerHTML = 'Wait for Initiation...';
	// mobilenet.load().catch(console.error)
        net = await mobilenet.load()
        console.log('Sucessfully loaded model');
        bi.innerHTML = 'Predict'}
  else {console.log('Model already loaded')};

  // Make a prediction through the model on our image.
  const imgEl = document.getElementById('output');
  const result = await net.classify(imgEl);

      document.getElementById('console_pic').innerText =
      `Prediction: ${result[0].className}
      Probability: ${Math.round(result[0].probability*100)} %
    `;
}



// Function that activates (starts webcam app) and deactivates the Webcam-Prediction
function start_webcam(){
    if (webcamrunning == false)
        {app_webcam();
        }
    else {webcamrunning = false;
        bw.innerHTML = 'Activate Predicting';
        };
};


// Setup Webcam
async function setupWebcam() {
  return new Promise((resolve, reject) => {
    const navigatorAny = navigator;
    navigator.getUserMedia = navigator.getUserMedia ||
        navigatorAny.webkitGetUserMedia || navigatorAny.mozGetUserMedia ||
        navigatorAny.msGetUserMedia;
    if (navigator.getUserMedia) {
      navigator.getUserMedia({video: true},
        stream => {
          webcamElement.srcObject = stream;
          webcamElement.addEventListener('loadeddata',  () => resolve(), false);
        },
        error => reject());
    } else {
      reject();
    }
  });
}



// Webcam application
async function app_webcam() {
  console.log('Loading mobilenet..');

  // Check if model loaded, if not, load it.
  if (net == undefined)
     {bw.innerHTML = 'Wait for Initiation...';
     net = await mobilenet.load();
     console.log('Sucessfully loaded model');}
  else {console.log('Model already loaded')};

  await setupWebcam();
  webcamrunning =true;
  bw.innerHTML = 'Stop Predicting';

  while (webcamrunning) {

    const result = await net.classify(webcamElement);

    document.getElementById('console_vid').innerText =
      `Prediction: ${result[0].className}
      Probability: ${Math.round(result[0].probability*100)} %
    `;

    // Give some breathing room by waiting for the next animation frame to
    // fire.
    await tf.nextFrame();
  }
}
;