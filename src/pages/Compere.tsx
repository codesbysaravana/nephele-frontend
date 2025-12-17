import React, { useState } from "react";
import "../styles/Compere.css";

const Compere: React.FC = () => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    const response = await fetch("https://nephele-backend.onrender.com/tts", {
      method: "POST",
      body: formData,
    });

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    setAudioUrl(url);

    setLoading(false);
  };

  return (
    <div className="compere-wrapper fade-in">
      <div className="compere-card card hover-lift">
        <h2 className="compere-heading heading">Text → Speech Compere</h2>

        <label className="file-drop">
          <input type="file" accept=".txt" onChange={handleFileUpload} />
          <span>Drop a .txt file or click to upload</span>
        </label>

        {loading && (
          <div className="loading-indicator">
            <span className="loader" />
            <p>Generating speech…</p>
          </div>
        )}

        {audioUrl && (
          <div className="audio-player">
            <audio controls src={audioUrl} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Compere;
