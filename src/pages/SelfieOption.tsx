import React, { useEffect, useRef, useState } from "react";

const SelfieOption: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [email, setEmail] = useState("");
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [status, setStatus] = useState("");

  // Open camera
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      });

    // Auto capture after 5 seconds
    const timer = setTimeout(capturePhoto, 5000);
    return () => clearTimeout(timer);
  }, []);

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx?.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (blob) {
        setImageBlob(blob);
        setStatus("Photo captured 📸");
      }
    }, "image/jpeg");
  };

  const sendPhoto = async () => {
    if (!imageBlob || !email) {
      alert("Email or photo missing");
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("file", imageBlob, "photo.jpg");

    setStatus("Sending email...");

    const res = await fetch("http://localhost:8000/send-email", {
      method: "POST",
      body: formData,
    });

    if (res.ok) setStatus("Email sent successfully ✅");
    else setStatus("Failed to send ❌");
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Auto Photo Capture</h2>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ width: 320, borderRadius: 10 }}
      />

      <canvas ref={canvasRef} style={{ display: "none" }} />

      <div style={{ marginTop: 20 }}>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: 8, width: 250 }}
        />
      </div>

      <button
        onClick={sendPhoto}
        style={{ marginTop: 12, padding: "10px 20px" }}
      >
        Send Photo
      </button>

      <p>{status}</p>
    </div>
  );
};

export default SelfieOption;
