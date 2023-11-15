import { useRef, useState, useCallback, useEffect } from "react";
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
    <>
      {isCaptureEnable || (
        <button onClick={() => setCaptureEnable(true)}>Enable Webcam</button>
      )}
      {isCaptureEnable && (
        <>
          <div>
            <button onClick={() => setCaptureEnable(false)}>Stop Webcam </button>
          </div>
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
          <p>Most Recent Image:</p>
        </>
      )}
      {url && (
        <>
          <div>
            <button
              onClick={() => {
                setUrl(null);
              }}
            >
              delete
            </button>
          </div>
          <div>
            <img src={url} alt="Screenshot" />
          </div>
        </>
      )}
    </>
  );
};
