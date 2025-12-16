import { useState, useRef } from "react";
import "../styles/Teaching.module.css"
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
  <div className="teachingRoot">
    <h2 className="teachingTitle">Teaching Assistant</h2>

    {/* Upload */}
    <input
      className="teachingFileInput"
      type="file"
      accept=".txt,.pdf,.docx"
      onChange={(e) => setFile(e.target.files?.[0] || null)}
    />

    <button
      className="teachingPrimaryButton"
      onClick={handleUpload}
      disabled={loading}
    >
      {loading ? "Processing…" : "Upload & Ingest"}
    </button>

    {/* Lessons */}
    {lessons.length > 0 && (
      <div className="teachingSection">
        <h3 className="teachingSectionTitle">Lessons</h3>

        <div className="lessonList">
          {lessons.map((lesson) => (
            <button
              key={lesson.lesson_index}
              className="lessonItem"
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
      <div className="teachingSection">
        <h3 className="teachingSectionTitle">Teaching Content</h3>

        <p className="teachingContent">{teachingText}</p>

        <button
          className="teachingSecondaryButton"
          onClick={playAudio}
        >
          Play Narration
        </button>

        <audio
          ref={audioRef}
          controls
          className="teachingAudio"
        />
      </div>
    )}

    {/* Error */}
    {error && (
      <div className="teachingError">
        <pre>{error}</pre>
      </div>
    )}
  </div>
);

}
