import jsPDF from "jspdf";

export const exportFeedbackPdf = (
  feedback: any,
  candidateName: string,
  role: string
) => {
  const doc = new jsPDF();
  let y = 20;

  // Title
  doc.setFontSize(18);
  doc.text("AI Interview Feedback Report", 20, y);
  y += 12;

  // Candidate info
  doc.setFontSize(12);
  doc.text(`Candidate Name: ${candidateName || "N/A"}`, 20, y);
  y += 6;

  doc.text(`Role Applied For: ${role || "N/A"}`, 20, y);
  y += 10;

  // Score
  doc.text(`ATS Score: ${feedback.score} / 100`, 20, y);
  y += 6;

  doc.text(`Hire Recommendation: ${feedback.hire_recommendation}`, 20, y);
  y += 12;

  // Helper to wrap long text
  const writeList = (title: string, items: string[]) => {
    doc.setFontSize(14);
    doc.text(title, 20, y);
    y += 8;

    doc.setFontSize(11);
    items.forEach((item) => {
      const lines = doc.splitTextToSize(`• ${item}`, 170);
      doc.text(lines, 25, y);
      y += lines.length * 6;
    });

    y += 6;
  };

  writeList("Strengths", feedback.strengths || []);
  writeList("Weaknesses", feedback.weaknesses || []);
  writeList("Improvements", feedback.improvements || []);

  doc.save("Interview_Feedback_Report.pdf");
};
