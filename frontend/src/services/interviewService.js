const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

async function request(url, options) {
  const response = await fetch(url, options)

  if (!response.ok) {
    const body = await response.text()

    throw new Error(
      `Interview API error ${response.status}: ${body}`
    )
  }

  return response.json()
}

export async function startInterview(candidateId) {
  return request(`${API_BASE_URL}/api/interview`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
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
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      session_id: sessionId,
      candidate_id: candidateId,
      user_response: userResponse,
    }),
  })
}
