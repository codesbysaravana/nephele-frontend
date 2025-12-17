import React, { useRef, useState, useEffect } from "react";
import jsQR from "jsqr";
import { useFrontCamera } from "../hooks/useFrontCamera"; // <-- import the hook

interface ScanData {
  name: string;
  roll_no: string;
  role: string;
}

const QrScanner: React.FC = () => {
  const { videoRef } = useFrontCamera();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [status, setStatus] = useState("🤖 Initializing Scanner...");
  const lastDetectedRef = useRef<string>("");
  const cooldownRef = useRef(false);
  const COOLDOWN_TIME = 3000;

  const sendToBackend = async (data: ScanData) => {
    try {
      const response = await fetch(
        "https://nephele-backend.onrender.com/scan",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) throw new Error("Server error");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const audio = new Audio(url);
      audio.play();

      setStatus(`🙏 Greetings ${data.name}`);
    } catch (err) {
      console.error(err);
      setStatus("❌ Error connecting to backend");
    }
  };

  const scanFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    if (video.readyState === video.HAVE_ENOUGH_DATA && !cooldownRef.current) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code && code.data !== lastDetectedRef.current) {
        lastDetectedRef.current = code.data;
        setStatus("📡 QR Detected! Sending to backend...");

        try {
          const [name, roll_no, role] = code.data.split(",");
          cooldownRef.current = true;
          sendToBackend({ name, roll_no, role });
          setTimeout(() => {
            cooldownRef.current = false;
          }, COOLDOWN_TIME);
        } catch {
          setStatus("❌ Invalid QR format");
        }
      } else {
        setStatus("🔍 Scanning...");
      }
    }

    requestAnimationFrame(scanFrame);
  };

  useEffect(() => {
    requestAnimationFrame(scanFrame);
  }, [videoRef.current]);

  return (
    <div className="card qrScanner"> {/* unified card style */}
      <h2 className="heading qrStatus">{status}</h2> {/* gold heading style */}

      <div className="qrCameraFrame card"> {/* card-style video frame ss*/}
        <video ref={videoRef} className="qrVideo" muted playsInline />
      </div>

      <canvas ref={canvasRef} className="qrCanvas" />
    </div>
  );
};

export default QrScanner;
