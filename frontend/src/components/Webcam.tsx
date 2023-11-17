import { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import "../App.css";

const videoConstraints = {
  width: 720,
  height: 360,
  facingMode: "user"
};

export const WebcamCapture = () => {
  const [isCaptureEnable, setCaptureEnable] = useState<boolean>(false);
  const webcamRef = useRef<Webcam>(null);
  const [url, setUrl] = useState<string | null>(null);
  // const capture = useCallback(() => {
  //   const imageSrc = webcamRef.current?.getScreenshot();
  //   if (imageSrc) {
  //     setUrl(imageSrc);
  //     console.log(imageSrc)
  //     setInterval((imageSrc: any) => {
  //       console.log(url)
  //       sendImageToBackend(imageSrc);
  //     }, 2000);

  //   }
  // }, [webcamRef]);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
          setUrl(imageSrc);
          sendImageToBackend(imageSrc);
        }
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  async function sendImageToBackend(imageData: any){
    fetch('https://5000-mandipadk-trashtalk-3bad4zni6by.ws-us106.gitpod.io/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: imageData }),
    })
    .then(response => response.text())
    .then(message => console.log(message))
    .catch(error => console.error('Error:', error));
  }

  return (
    <div className="flex flex-row justify-center gap-10">
      {/* <div className="grid grid-cols-2 gap-4">
      <div>
        01
        </div>

      <div>02</div>
      </div> */}

      <div>
      {isCaptureEnable || (
        <button className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" onClick={() => setCaptureEnable(true)}>Enable Webcam</button>
      )}
      {isCaptureEnable && (
        <>
           <p>Live Webcam:</p>
          <div>
            <Webcam
              audio={false}
              width={540}
              height={360}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
            />
          </div>

          <div>
            <button className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" onClick={() => setCaptureEnable(false)}>Stop Webcam </button>
          </div>
        </>
        
      )}
      </div>

      <div>
      {url && (
        <>
        <div>
        <p>Most Recent Image:</p>
          
          <div >
            <img src={url} alt="Screenshot"/>
          </div>
          <div>
            <button
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={() => {
                setUrl(null);
              }}
            >
              Delete Image
            </button>
          </div>
          </div>
        </>
      )}
      </div>

    </div>
  );
};
