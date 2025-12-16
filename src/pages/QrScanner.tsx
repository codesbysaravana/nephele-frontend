import React, { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import "../styles/QrScanner.module.css"

interface ScanData {
  name: string;
  roll_no: string;
  role: string;
}

const QrScanner: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [status, setStatus] = useState("🤖 Initializing Scanner...");
  const lastDetectedRef = useRef<string>("");
  const cooldownRef = useRef(false);
  const COOLDOWN_TIME = 3000;

  const sendToBackend = async (data: ScanData) => {
    try {
      const response = await fetch("https://nephele-backend.onrender.com/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Server error");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const audio = new Audio(url);
      audio.play();

      setStatus(`🎵 Greeting audio played for ${data.name}`);
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

        // Parse QR string: "name,roll_no,role"
        try {
          const [name, roll_no, role] = code.data.split(",");
          cooldownRef.current = true;
          sendToBackend({ name, roll_no, role });
          setTimeout(() => { cooldownRef.current = false; }, COOLDOWN_TIME);
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
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        requestAnimationFrame(scanFrame);
      } catch {
        setStatus("❌ Camera access denied");
      }
    };
    initCamera();

    return () => {
      const video = videoRef.current;
      if (video && video.srcObject) {
        (video.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  return (
  <div className="qrScanner">
    <h2 className="qrStatus">{status}</h2>

    <div className="qrCameraFrame">
      <video
        ref={videoRef}
        className="qrVideo"
        muted
        playsInline
      />
    </div>

    <canvas ref={canvasRef} className="qrCanvas" />
  </div>
  );
};

export default QrScanner;
