const cont = document.querySelector(`.container`);
const video = document.getElementById(`video`);

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri(`/models`),
  faceapi.nets.faceLandmark68Net.loadFromUri(`/models`),
  faceapi.nets.faceRecognitionNet.loadFromUri(`/models`),
  faceapi.nets.faceExpressionNet.loadFromUri(`/models`)
]).then(startVideo)
function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
    )
  }
  
  video.addEventListener(`play`, () =>{
    const canvas = faceapi.createCanvasFromMedia(video)
    cont.appendChild(canvas)
    const displaySize = {width: video.width, height: video.height,}
    faceapi.matchDimensions(canvas, displaySize)
    setInterval(async () => {
      const datections = await faceapi.detectAllFaces(video, 
        new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
        console.log(datections);
        const resizedDatections = faceapi.resizeResults(datections, displaySize)
        canvas.getContext(`2d`).clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizedDatections)
        faceapi.draw.drawFaceLandmarks(canvas, resizedDatections)
        faceapi.draw.drawFaceExpressions(canvas, resizedDatections)
    }, 100)
  })