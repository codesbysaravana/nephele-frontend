import { useState, useEffect } from "react";
import UploadResume from "./UploadResume";
import RoleSelection from "./RoleSelection";
import AnswerBox from "./AnswerBox";
import FeedbackPanel from "./FeedBackPanel";
import "../../styles/MockC.css";

const MockCentral = () => {
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [question, setQuestion] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<any | null>(null);
  const [candidateName, setCandidateName] = useState("");
  const [role, setRole] = useState<string>("");

  // 🔊 STEP 3 — TTS Helper
  const speakText = async (text: string) => {
    try {
      const res = await fetch("https://nephele-backend.onrender.com/interview/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const blob = await res.blob();
      const audioUrl = URL.createObjectURL(blob);
      new Audio(audioUrl).play();
    } catch (err) {
      console.error("TTS failed", err);
    }
  };

  // 🔊 STEP 4 — Auto speak every question
  useEffect(() => {
    if (question && sessionId && !feedback) {
      speakText(question);
    }
  }, [question]);

  // Existing feedback TTS
  const speakFeedback = (fb: any) => {
    const text = `
      Your interview score is ${fb.score} out of 100.
      Hire recommendation is ${fb.hire_recommendation}.
      Strengths include ${fb.strengths.join(", ")}.
      Areas to improve include ${fb.improvements.join(", ")}.
    `;
    speechSynthesis.speak(new SpeechSynthesisUtterance(text));
  };

  useEffect(() => {
    if (feedback) speakFeedback(feedback);
  }, [feedback]);

  return (
    <div className="mock-central">
      <div className="mock-central-card">
        <div className="mock-central-title">Interview Setup</div>

        <div className="mock-central-subtext">
          Upload your resume and choose your target role
        </div>

        <div className="mock-central-body">
          {!resumeId && <UploadResume onUploaded={setResumeId} />}

          {resumeId && !sessionId && (
            <>
              <input
                className="mock-input"
                placeholder="Enter your name"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
              />

              <RoleSelection
                resumeId={resumeId}
                candidateName={candidateName}
                onSessionStarted={(sid, q, selectedRole) => {
                  setSessionId(sid);
                  setQuestion(q);
                  setRole(selectedRole);
                }}
              />
            </>
          )}

          {sessionId && question && !feedback && (
            <>
              <div className="question-box">{question}</div>

              <AnswerBox
                sessionId={sessionId}
                onNewQuestion={setQuestion}
                onCompleted={setFeedback}
              />
            </>
          )}

          {feedback && (
            <FeedbackPanel
              feedback={feedback}
              candidateName={candidateName}
              role={role}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MockCentral;
