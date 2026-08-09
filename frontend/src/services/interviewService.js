import { supabase } from '../lib/Supabase'

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

async function request(url, options = {}) {
  let sessionData = null
  try {
    sessionData = await supabase.auth.getSession()
  } catch {
    // Auth token extraction is optional
  }
  const token = sessionData?.data?.session?.access_token

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  let response
  try {
    response = await fetch(url, {
      ...options,
      headers,
    })
  } catch (err) {
    throw new Error(
      `Failed to connect to backend server at ${API_BASE_URL}. Please ensure the FastAPI server is running.`
    )
  }

  if (!response.ok) {
    const rawText = await response.text()
    let errorDetail = rawText
    try {
      const parsed = JSON.parse(rawText)
      errorDetail = parsed.detail || rawText
    } catch {
      // Use raw text if not valid JSON
    }
    throw new Error(
      `Interview API error (${response.status}): ${errorDetail}`
    )
  }

  return response.json()
}

export async function startInterview(candidateId) {
  return request(`${API_BASE_URL}/api/interview`, {
    method: 'POST',
    body: JSON.stringify({
      candidate_id: candidateId,
    }),
  })
}

export async function submitInterviewAnswer({
  sessionId,
  candidateId,
  userResponse,
}) {
  return request(`${API_BASE_URL}/api/interview`, {
    method: 'POST',
    body: JSON.stringify({
      session_id: sessionId,
      candidate_id: candidateId,
      user_response: userResponse,
    }),
  })
}
