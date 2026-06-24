// lib/lexcare-ai.ts
const API_URL = "https://ai.lexrunit.com";
const API_KEY = process.env.NEXT_PUBLIC_LEXRUNIT_API_KEY as string;

const headers = {
  "Content-Type": "application/json",
  "LEXRUNIT-API-KEY": API_KEY,
};

export const sendPatientQuestion = async (message: string, sessionId?: string, userId?: string) => {
  const response = await fetch(`${API_URL}/chat/patient`, {
    method: "POST",
    headers,
    body: JSON.stringify({ session_id: sessionId, user_id: userId, message }),
  });
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return await response.json(); // { session_id, response }
};

export const sendDoctorQuestion = async (message: string, sessionId?: string, userId?: string) => {
  const response = await fetch(`${API_URL}/chat/doctor`, {
    method: "POST",
    headers,
    body: JSON.stringify({ session_id: sessionId, user_id: userId, message }),
  });
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return await response.text(); // doctor advice as string
};

export const sendConsultMessage = async (message: string, sessionId?: string) => {
  const response = await fetch(`${API_URL}/consult`, {
    method: "POST",
    headers,
    body: JSON.stringify({ session_id: sessionId, message }),
  });
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  const data = await response.json();
  if (data.done) {
    return {
      sessionId: data.session_id,
      isComplete: true,
      diagnosis: data.disease,
      candidateDiagnoses: data.candidates,
      advice: data.advice,
    };
  } else {
    return {
      sessionId: data.session_id,
      isComplete: false,
      nextQuestion: data.question,
      candidateDiagnoses: data.candidates,
    };
  }
};

export const analyzeConsultationAudio = async (audioUrl: string, consultationId: string) => {
  const response = await fetch(`${API_URL}/listen-consultation`, {
    method: "POST",
    headers,
    body: JSON.stringify({ audio_url: audioUrl, consultation_id: consultationId }),
  });
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return await response.json(); // { transcript, summary, recommendation }
};