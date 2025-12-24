import React from "react";
import "../../styles/FeedBackPanel.css";
import { exportFeedbackPdf } from "../../utils/exportFeedbackPdf";

interface Feedback {
  score: number;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  hire_recommendation: string;
}

interface Props {
  feedback: Feedback;
  candidateName: string;
  role: string;
}

const FeedbackPanel: React.FC<Props> = ({
  feedback,
  candidateName,
  role,
}) => {
  return (
    <div className="feedback-panel">
      <h2>Interview Feedback</h2>

      <div className="candidate-meta">
        <div><strong>Candidate:</strong> {candidateName}</div>
        <div><strong>Role:</strong> {role}</div>
      </div>

      {/* SCORE BAR */}
      <div className="score-section">
        <div className="score-label">ATS Score</div>
        <div className="score-bar">
          <div
            className="score-fill"
            style={{ width: `${feedback.score}%` }}
          />
        </div>
        <div className="score-value">{feedback.score}/100</div>
      </div>

      {/* HIRE RECOMMENDATION */}
      <div className={`hire-badge ${feedback.hire_recommendation.toLowerCase()}`}>
        Hire Recommendation: {feedback.hire_recommendation}
      </div>

      {/* STRENGTHS */}
      <div className="feedback-section">
        <h3>Strengths</h3>
        <ul>
          {feedback.strengths.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>

      {/* WEAKNESSES */}
      <div className="feedback-section">
        <h3>Weaknesses</h3>
        <ul>
          {feedback.weaknesses.map((w, i) => (
            <li key={i}>{w}</li>
          ))}
        </ul>
      </div>

      {/* IMPROVEMENTS */}
      <div className="feedback-section">
        <h3>Improvements</h3>
        <ul>
          {feedback.improvements.map((imp, i) => (
            <li key={i}>{imp}</li>
          ))}
        </ul>
      </div>

      <button
        className="export-btn"
        onClick={() =>
          exportFeedbackPdf(feedback, candidateName, role)
        }
      >
        Download PDF Report
      </button>
    </div>
  );
};

export default FeedbackPanel;
