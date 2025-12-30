import { useState, useEffect } from "react";
import "../../styles/RoleSelection.css";

interface Props {
  resumeId: string;
  candidateName: string;
  onSessionStarted: (
    sessionId: string,
    question: string,
    role: string
  ) => void;
}

const RoleSelection: React.FC<Props> = ({
  resumeId,
  candidateName,
  onSessionStarted,
}) => {
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    speechSynthesis.speak(
      new SpeechSynthesisUtterance(
        "Which role do you want to apply for?"
      )
    );
  }, []);

  const submit = async () => {
    if (!role.trim() || !candidateName.trim()) return;

    setStatus("Starting session…");

    const res = await fetch("https://nephele-backend.onrender.com/interview/start_session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        resume_id: resumeId,
        role,
        candidate_name: candidateName,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      speechSynthesis.speak(
        new SpeechSynthesisUtterance(data.question)
      );

      onSessionStarted(data.session_id, data.question, role);
      setStatus("");
    } else {
      setStatus("Failed to start session");
    }
  };

  return (
    <div className="role-selection">
      <div className="role-title">Choose Your Target Role</div>

      <input
        className="role-input"
        placeholder="e.g. Frontend Developer"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />

      <button
        className="start-btn"
        onClick={submit}
        disabled={!role.trim() || !candidateName.trim()}
      >
        Start Interview
      </button>

      {status && <div className="role-status">{status}</div>}
    </div>
  );
};

export default RoleSelection;
