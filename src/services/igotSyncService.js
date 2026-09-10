// iGOT Karmayogi API Telemetry & Synchronization Service
// Simulates two-way sync with the Karmayogi Bharat platform:
// 1. Telemetry ingestion (course progress, time spent, quiz grades)
// 2. Automated competency score update upon course/module completion

const STORAGE_KEY_ENROLLMENTS = 'samarth_stat_igot_enrollments';
const STORAGE_KEY_COMPLETIONS = 'samarth_stat_igot_completions';

export function getStoredEnrollments(personaId) {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_ENROLLMENTS}_${personaId}`);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

export function saveEnrollment(personaId, courseId, progress = 0) {
  const current = getStoredEnrollments(personaId);
  current[courseId] = {
    courseId,
    progress,
    enrolledAt: current[courseId]?.enrolledAt || new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
    status: progress >= 100 ? 'completed' : 'in_progress'
  };
  try {
    localStorage.setItem(`${STORAGE_KEY_ENROLLMENTS}_${personaId}`, JSON.stringify(current));
  } catch (e) {
    console.error('Storage error', e);
  }
  return current;
}

export function simulateCourseProgress(personaId, courseId, increment = 25) {
  const current = getStoredEnrollments(personaId);
  const prevProgress = current[courseId]?.progress || 0;
  const newProgress = Math.min(100, prevProgress + increment);
  return saveEnrollment(personaId, courseId, newProgress);
}

/**
 * Simulates syncing with the iGOT Karmayogi Bharat API endpoint.
 * Returns updated telemetry and any newly awarded competencies.
 */
export async function syncWithKarmayogiAPI(persona) {
  // Simulate network roundtrip latency
  await new Promise(resolve => setTimeout(resolve, 800));

  const enrollments = getStoredEnrollments(persona.id);
  const completedCourses = Object.values(enrollments).filter(e => e.status === 'completed');

  return {
    syncTimestamp: new Date().toISOString(),
    apiStatus: 'ONLINE_HEALTHY',
    endpoint: 'https://api.igotkarmayogi.gov.in/v2/telemetry/sync',
    personaId: persona.id,
    karmayogiId: `KG-${persona.employeeId.replace(/[^A-Za-z0-9]/g, '')}`,
    syncedCredits: persona.karmayogiCredits + (completedCourses.length * 150),
    syncedHours: persona.learningHours + (completedCourses.length * 8.5),
    enrolledCount: Object.keys(enrollments).length,
    completedCount: completedCourses.length
  };
}
