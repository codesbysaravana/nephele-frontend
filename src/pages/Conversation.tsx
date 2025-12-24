import { useRef, useState } from "react";
import "../styles/Conversation.css";

const BACKEND_URL = "https://nephele-backend.onrender.com";

type Phase = "idle" | "recording" | "thinking" | "speaking";
type Message = { role: "user" | "assistant"; content: string };

const Conversation: React.FC = () => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const thinkingAudioRef = useRef<HTMLAudioElement | null>(null);
  const assistantAudioRef = useRef<HTMLAudioElement | null>(null);

  const [phase, setPhase] = useState<Phase>("idle");
  const [conversation, setConversation] = useState<Message[]>([]);

  const stopAllAudio = () => {
    thinkingAudioRef.current?.pause();
    thinkingAudioRef.current = null;

    if (assistantAudioRef.current) {
      assistantAudioRef.current.pause();
      assistantAudioRef.current.currentTime = 0;
      assistantAudioRef.current = null;
    }
  };

  const startRecording = async () => {
    stopAllAudio();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;

    const recorder = new MediaRecorder(stream, {
      mimeType: MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "",
    });

    mediaRecorderRef.current = recorder;
    chunksRef.current = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = handleStop;
    recorder.start();
    setPhase("recording");
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setPhase("thinking");

    const thinkingAudio = new Audio("/thinking.mp3");
    thinkingAudio.loop = true;
    thinkingAudio.volume = 0.25;
    thinkingAudio.play().catch(() => {});
    thinkingAudioRef.current = thinkingAudio;
  };

  const handleStop = async () => {
    const webmBlob = new Blob(chunksRef.current, { type: "audio/webm" });
    const formData = new FormData();
    formData.append("file", webmBlob, "voice.webm");
    formData.append("history", JSON.stringify(conversation));

    try {
      const response = await fetch(`${BACKEND_URL}/agent-memory`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Agent request failed");

      thinkingAudioRef.current?.pause();
      thinkingAudioRef.current = null;

      const buffer = await response.arrayBuffer();
      const audioBlob = new Blob([buffer], { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(audioBlob);

      const audio = new Audio(audioUrl);
      assistantAudioRef.current = audio;

      setPhase("speaking");

      const lastUserMessage: Message = {
        role: "user",
        content: conversation[conversation.length - 1]?.content || "",
      };
      const assistantMessage: Message = {
        role: "assistant",
        content: "AUDIO RESPONSE (optional text fallback)",
      };
      setConversation((prev) => [...prev, lastUserMessage, assistantMessage]);

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        assistantAudioRef.current = null;
        setPhase("idle");
      };

      await audio.play();
    } catch (err) {
      console.error("Voice agent error:", err);
      setPhase("idle");
    } finally {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  return (
    <> <br></br>
<h1
  style={{
    fontFamily: "Mersilla",
    fontSize: "2.4rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#FFD700",
    marginBottom: "2rem",
    textAlign: "center",
    textShadow: `
      0 2px 8px rgba(255,215,0,0.25),
      0 0 24px rgba(255,215,0,0.15)
    `,
  }}
>
  Conversation
</h1>


    <div className="conversation card fade-in">
      {phase === "idle" && (
        <button className="voice-button hover-lift" onClick={startRecording}>
          🎙️ Talk to Nephele
        </button>
      )}

      {phase === "recording" && (
        <button
          className="voice-button voice-button--recording hover-lift"
          onClick={stopRecording}
        >
          ⏹️ Send
        </button>
      )}

    <div className={`waveform ${phase}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} />
      ))}
    </div>
      {phase === "thinking" && (
        <div className="status status--thinking badge">
          🤔 Thinking…
        </div>
      )}

      {phase === "speaking" && (
        <button className="voice-button hover-lift" onClick={startRecording}>
          ✋ Interrupt & Speak
        </button>
      )}
    </div>
    </>
  );
};

export default Conversation;
