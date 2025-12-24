import { useState } from "react";
import "../../styles/UploadResume.css";

interface Props {
  onUploaded: (resumeId: string) => void;
}

const UploadResume: React.FC<Props> = ({ onUploaded }) => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  const upload = async () => {
    if (!file) return;

    setStatus("Uploading…");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:8000/upload_resume", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      onUploaded(data.resume_id);
    } else {
      setStatus("Upload failed. Please try again.");
    }
  };

  return (
    <div className="upload-resume">
      <div className="upload-title">Upload Your Resume</div>

      <div className="file-input-wrapper">
        <input
          type="file"
          className="file-input"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </div>

      <button
        className="upload-btn"
        onClick={upload}
        disabled={!file}
      >
        Upload & Continue
      </button>

      {status && <div className="upload-status">{status}</div>}
    </div>
  );
};

export default UploadResume;
