import React, { useState } from "react";

interface Props {
  resumeId: string;
  onSessionStart: (sessionId: string, firstQuestion: string) => void;
}

const RoleSelection: React.FC<Props> = ({ resumeId, onSessionStart }) => {
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");

  // TTS function using Web Speech API
  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  // STT function using Web Speech API
  const startListening = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();
    recognition.onresult = (event: any) => {
      const spokenRole = event.results[0][0].transcript;
      setRole(spokenRole);
    };
  };

  const handleSubmit = async () => {
    if (!role) return;
    setStatus("Starting session...");

    try {
      const res = await fetch("http://localhost:8000/start_session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume_id: resumeId, role })
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("Session started!");
        speak(data.question);
        onSessionStart(data.session_id, data.question);
      } else {
        setStatus(`Error: ${data.message || "Failed to start session"}`);
      }
    } catch (err) {
      console.error(err);
      setStatus("Failed to start session. Check console.");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Which role do you want?</h2>
      <input
        type="text"
        placeholder="Type your role or use voice"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />
      <button onClick={startListening} style={{ marginLeft: 10 }}>🎤 Speak</button>
      <button onClick={handleSubmit} style={{ marginLeft: 10 }}>Start Q&A</button>
      <p>{status}</p>
    </div>
  );
};

export default RoleSelection;
