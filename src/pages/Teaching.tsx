import { useState, useRef } from "react";
import "../App.css"; // <- switched to App.css for styles

/* =======================
   Types
======================= */

type IngestResponse = {
  filename: string;
  chunks_created: number;
};

type Lesson = {
  lesson_index: number;
  title: string;
  content: string;
};

/* =======================
   API Helpers
======================= */

const API = "https://nephele-backend.onrender.com/teaching";

async function ingestDocument(file: File): Promise<IngestResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API}/ingest`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function fetchLessons(filename: string): Promise<Lesson[]> {
  const res = await fetch(`${API}/lessons/${filename}`);
  if (!res.ok) throw new Error(await res.text());

  const data = await res.json();
  return data.lessons;
}

async function generateTeaching(
  filename: string,
  lessonIndex: number
): Promise<string> {
  const res = await fetch(
    `${API}/lessons/${filename}/${lessonIndex}/generate`,
    { method: "POST" }
  );

  if (!res.ok) throw new Error(await res.text());

  const data = await res.json();
  return data.teaching_text;
}

/* =======================
   Component
======================= */

export default function TeachingAssistant() {
  const [file, setFile] = useState<File | null>(null);
  const [filename, setFilename] = useState<string | null>(null);

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  const [teachingText, setTeachingText] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  /* =======================
     Actions
  ======================= */

  const handleUpload = async () => {
    if (!file) return setError("Please select a file");

    setLoading(true);
    setError(null);
    setLessons([]);
    setTeachingText(null);

    try {
      const ingest = await ingestDocument(file);
      setFilename(ingest.filename);

      const lessons = await fetchLessons(ingest.filename);
      setLessons(lessons);
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (lesson: Lesson) => {
    if (!filename) return;

    setLoading(true);
    setError(null);
    setTeachingText(null);
    setActiveLesson(lesson);

    try {
      const text = await generateTeaching(filename, lesson.lesson_index);
      setTeachingText(text);
    } catch (err: any) {
      setError(err.message || "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const playAudio = () => {
    if (!filename || !activeLesson) return;

    if (audioRef.current) {
      audioRef.current.src = `${API}/lessons/${filename}/${activeLesson.lesson_index}/tts`;
      audioRef.current.play();
    }
  };

  /* =======================
     UI
  ======================= */
  return (
    <div className="main-content fade-in">
      <h2 className="heading">Teaching Assistant</h2>

      {/* Upload */}
      <input
        className="file-input card hover-lift"
        type="file"
        accept=".txt,.pdf,.docx"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button
        className="primary-button card hover-lift"
        onClick={handleUpload}
        disabled={loading}
      >
        {loading ? "Processing…" : "Upload & Ingest"}
      </button>

      {/* Lessons */}
      {lessons.length > 0 && (
        <div className="card fade-in">
          <h3 className="heading">Lessons</h3>
          <div className="lessonList">
            {lessons.map((lesson) => (
              <button
                key={lesson.lesson_index}
                className="badge hover-lift"
                onClick={() => handleGenerate(lesson)}
              >
                {lesson.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Teaching Content */}
      {teachingText && (
        <div className="card fade-in">
          <h3 className="heading">Teaching Content</h3>

          <p className="metric-value">{teachingText}</p>

          <button className="secondary-button card hover-lift" onClick={playAudio}>
            Play Narration
          </button>

          <audio ref={audioRef} controls className="audio-player" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="card status-inactive fade-in">
          <pre>{error}</pre>
        </div>
      )}
    </div>
  );
}
