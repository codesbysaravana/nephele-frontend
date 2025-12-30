import React, { useState, useRef } from "react";
import "../../styles/AnswerBox.css";

interface AnswerBoxProps {
  sessionId: string;
  onNewQuestion: (question: string) => void;
  onCompleted: (feedback: any) => void;
}

const AnswerBox: React.FC<AnswerBoxProps> = ({
  sessionId,
  onNewQuestion,
  onCompleted,
}) => {
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  // ---------------- SUBMIT ANSWER ----------------
  const submitAnswer = async () => {
    if (!answer.trim() || loading) return;

    setLoading(true);

    try {
      const res = await fetch("https://nephele-backend.onrender.com/interview/submit_answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          answer,
        }),
      });

      const data = await res.json();

      if (data.status === "completed") {
        onCompleted(data.feedback);
        setAnswer("");
        return;
      }

      onNewQuestion(data.question);
      setAnswer("");
    } catch (err) {
      console.error("Submit answer failed", err);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- START RECORDING ----------------
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setRecording(true);
    } catch (err) {
      console.error("Mic access denied", err);
    }
  };

  // ---------------- STOP + TRANSCRIBE ----------------
  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;

    recorder.onstop = async () => {
      try {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });

        const formData = new FormData();
        formData.append("file", audioBlob);

        const res = await fetch("http://localhost:8000/stt", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        setAnswer(data.text || "");
      } catch (err) {
        console.error("STT failed", err);
      }
    };

    recorder.stop();
    setRecording(false);

    // 🔴 Stop mic stream properly
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  return (
    <div className="answer-box">
      <textarea
        className="answer-input"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Speak or type your answer..."
        disabled={loading}
      />

      <div className="mic-controls">
        {!recording ? (
          <button onClick={startRecording} disabled={loading}>
            🎙️ Speak Answer
          </button>
        ) : (
          <button onClick={stopRecording}>
            ⏹ Stop
          </button>
        )}
      </div>

      <button
        className="answer-submit"
        onClick={submitAnswer}
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit Answer"}
      </button>
    </div>
  );
};

export default AnswerBox;
