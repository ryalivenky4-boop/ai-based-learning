// REST API client for SAMARTH-STAT communicating with MySQL 8.0 Express Backend

const API_BASE = '/api';

export async function checkDatabaseHealth() {
  try {
    const res = await fetch(`${API_BASE}/db-status`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return { connected: false, error: err.message };
  }
}

export async function fetchTraineesFromDB() {
  try {
    const res = await fetch(`${API_BASE}/trainees`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend API not reachable, using fallback:', err.message);
    return null;
  }
}

export async function fetchTraineeByIdFromDB(traineeId) {
  try {
    const res = await fetch(`${API_BASE}/trainees/${traineeId}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function updateCompetencyScoreInDB(traineeId, competencyId, score) {
  try {
    const res = await fetch(`${API_BASE}/trainees/${traineeId}/competency`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ competencyId, score })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Failed to persist competency to MySQL:', err.message);
    return null;
  }
}

export async function enrollCourseInDB(traineeId, courseId, courseType = 'iGOT', progress = 0) {
  try {
    const res = await fetch(`${API_BASE}/trainees/${traineeId}/enroll`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId, courseType, progress })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function completeCourseInDB(traineeId, courseData) {
  try {
    const res = await fetch(`${API_BASE}/trainees/${traineeId}/complete-course`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        courseId: courseData.id,
        courseType: courseData.type || 'iGOT',
        competencyId: courseData.competencyId,
        creditsAwarded: courseData.karmayogiCredits || 150,
        hoursAdded: courseData.durationHours || 8.0
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Failed to record course completion in MySQL:', err.message);
    return null;
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
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Failed to save quiz result to MySQL:', err.message);
    return null;
  }
}

export async function fetchQuizHistoryFromDB(traineeId) {
  try {
    const res = await fetch(`${API_BASE}/quizzes/history/${traineeId}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return [];
  }
}
