// REST API client for SAMARTH-STAT communicating with MySQL 8.0 Express Backend with JWT Auth

const API_BASE = '/api';

// Token Management
export function getToken() {
  return localStorage.getItem('samarth_token');
}

export function setToken(token) {
  if (token) {
    localStorage.setItem('samarth_token', token);
  } else {
    localStorage.removeItem('samarth_token');
  }
}

export function clearToken() {
  localStorage.removeItem('samarth_token');
}

// Authenticated fetch wrapper
async function authFetch(url, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...options,
    headers
  });

  if (res.status === 401) {
    clearToken();
    // Dispatch auth state change event
    window.dispatchEvent(new Event('samarth_auth_expired'));
    throw new Error('Session expired. Please log in again.');
  }

  return res;
}

// 1. Health & Database Status
export async function checkDatabaseHealth() {
  try {
    const res = await fetch(`${API_BASE}/db-status`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return { connected: false, error: err.message };
  }
}

async function parseResponse(res, defaultMsg = 'Request failed') {
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || defaultMsg);
    }
    return data;
  }
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Server returned error (${res.status}): ${text.substring(0, 100) || 'Service unavailable'}`);
  }
  return { success: true };
}

// 2. Authentication APIs
export async function registerUser(userData) {
  let res;
  try {
    res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
  } catch (netErr) {
    throw new Error('Cannot connect to backend server. Please check that the server is running on port 5000.');
  }

  const data = await parseResponse(res, 'Registration failed');

  if (data.token) {
    setToken(data.token);
  }

  return data;
}

export async function loginUser(email, password) {
  let res;
  try {
    res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
  } catch (netErr) {
    throw new Error('Cannot connect to backend server. Please check that the server is running on port 5000.');
  }

  const data = await parseResponse(res, 'Login failed');

  if (data.token) {
    setToken(data.token);
  }

  return data;
}


export async function fetchCurrentUser() {
  const token = getToken();
  if (!token) return null;

  try {
    const res = await authFetch(`${API_BASE}/auth/me`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('Failed to fetch current user profile:', err.message);
    return null;
  }
}

export async function logoutUser() {
  try {
    await fetch(`${API_BASE}/auth/logout`, { method: 'POST' });
  } catch (err) {
    console.warn('Logout notice:', err);
  } finally {
    clearToken();
  }
}


// 3. User Skills, Target Skills & Competency Gaps
export async function fetchUserSkills() {
  try {
    const res = await authFetch(`${API_BASE}/skills`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return [];
  }
}

export async function saveUserSkill(skillData) {
  const res = await authFetch(`${API_BASE}/skills`, {
    method: 'POST',
    body: JSON.stringify(skillData)
  });
  return await res.json();
}

export async function fetchTargetSkills() {
  try {
    const res = await authFetch(`${API_BASE}/skills/target`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return [];
  }
}

export async function addTargetSkill(targetData) {
  const res = await authFetch(`${API_BASE}/skills/target`, {
    method: 'POST',
    body: JSON.stringify(targetData)
  });
  return await res.json();
}

export async function fetchCompetencyGaps() {
  try {
    const res = await authFetch(`${API_BASE}/skills/gaps`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return [];
  }
}

export async function triggerCompetencyAnalysis() {
  const res = await authFetch(`${API_BASE}/skills/gaps/analyze`, {
    method: 'POST'
  });
  return await res.json();
}

// 4. Courses & Progress
export async function fetchCourses(filters = {}) {
  const query = new URLSearchParams(filters).toString();
  const url = `${API_BASE}/courses${query ? '?' + query : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

export async function fetchPersonalizedRecommendations() {
  try {
    const res = await authFetch(`${API_BASE}/courses/recommendations`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return [];
  }
}

export async function fetchCourseProgress() {
  try {
    const res = await authFetch(`${API_BASE}/courses/progress`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return [];
  }
}

export async function updateCourseProgress(courseId, progressPercentage, isCompleted = false) {
  const res = await authFetch(`${API_BASE}/courses/progress`, {
    method: 'POST',
    body: JSON.stringify({
      course_id: courseId,
      progress_percentage: progressPercentage,
      is_completed: isCompleted
    })
  });
  return await res.json();
}

// 5. Materials & AI Quizzes
export async function uploadLearningMaterial(fileName, textContent) {
  const res = await authFetch(`${API_BASE}/materials/upload`, {
    method: 'POST',
    body: JSON.stringify({
      file_name: fileName,
      text_content: textContent
    })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to upload material');
  return data;
}

export async function fetchLearningMaterials() {
  try {
    const res = await authFetch(`${API_BASE}/materials`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return [];
  }
}

export async function generateQuizFromAI(params) {
  const res = await authFetch(`${API_BASE}/quizzes/generate`, {
    method: 'POST',
    body: JSON.stringify(params)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to generate quiz');
  return data;
}

export async function fetchQuizzes() {
  try {
    const res = await authFetch(`${API_BASE}/quizzes`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return [];
  }
}

export async function fetchQuizDetails(quizId) {
  const res = await authFetch(`${API_BASE}/quizzes/${quizId}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

export async function submitQuizAttempt(quizId, answers) {
  const res = await authFetch(`${API_BASE}/quizzes/${quizId}/attempt`, {
    method: 'POST',
    body: JSON.stringify({ answers })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Quiz submission failed');
  return data;
}

export async function fetchQuizAttemptsHistory() {
  try {
    const res = await authFetch(`${API_BASE}/quizzes/attempts/history`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return [];
  }
}

export async function submitQuizResultToDB(traineeId, resultData) {
  try {
    const res = await fetch(`${API_BASE}/quizzes/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        traineeId,
        quizTitle: resultData.quizTitle,
        totalQuestions: resultData.totalQuestions,
        correctCount: resultData.correctCount,
        scorePercentage: resultData.scorePercentage,
        passed: resultData.passed,
        evaluations: resultData.evaluations
      })
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('Failed to save quiz result to MySQL:', err.message);
    return null;
  }
}

