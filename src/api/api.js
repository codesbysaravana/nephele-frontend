// Backend base URL
export const API_BASE_URL = "https://nephele-backend.onrender.com";

// --------------------
// INTERVIEW ROUTES
// --------------------
export const interviewAPI = {
  uploadResume: `${API_BASE_URL}/interview/upload_resume`,
  startSession: `${API_BASE_URL}/interview/start_session`,
  submitAnswer: `${API_BASE_URL}/interview/submit_answer`,
  tts: `${API_BASE_URL}/interview/tts`,
  stt: `${API_BASE_URL}/interview/stt`,
};

// --------------------
// ROOT / AGENT ROUTES
// --------------------
export const agentAPI = {
  voice: `${API_BASE_URL}/voice`,
  tts: `${API_BASE_URL}/tts`,
  agent: `${API_BASE_URL}/agent`,
  agentMemory: `${API_BASE_URL}/agent-memory`,
};

// --------------------
// TEACHING ROUTES
// --------------------
export const teachingAPI = {
  base: `${API_BASE_URL}/teaching`,
};

// --------------------
// COMPERE ROUTES
// --------------------
export const compereAPI = {
  compere: `${API_BASE_URL}/compere`,
};

// --------------------
// SCANNER ROUTES
// --------------------
export const qrscannerAPI = {
  scan: `${API_BASE_URL}/scan`,
};
