// Intelligent Recommendation Engine for MoSPI Trainees
// Bridges iGOT Karmayogi online modules and NSSTA TPAC recommended in-person/hybrid workshops

import { IGOT_COURSES } from '../data/igotCourses';
import { NSSTA_TPAC_PROGRAMMES } from '../data/nsstaCalendar';
import { analyzeCompetencyGaps } from './competencyEngine';

/**
 * Generates personalized learning pathways and course recommendations
 * based on identified skill gaps and trainee cadre/role.
 */
export function generatePersonalizedPathway(currentScores = {}, targetRoleKey = 'sso', cadre = 'SSS') {
  const gapAnalysis = analyzeCompetencyGaps(currentScores, targetRoleKey);
  const { criticalGaps, moderateGaps, gaps } = gapAnalysis;

  // Build a lookup map of competencyId -> gap severity
  const gapMap = {};
  gaps.forEach(g => {
    gapMap[g.competencyId] = g;
  });

  // Recommended iGOT Courses
  const recommendedIgot = [];
  // Recommended NSSTA Programmes
  const recommendedNssta = [];

  // Match iGOT courses
  IGOT_COURSES.forEach(course => {
    const gapInfo = gapMap[course.competencyId];
    if (gapInfo && (gapInfo.severity === 'critical' || gapInfo.severity === 'moderate')) {
      let priorityScore = gapInfo.gap * 10;
      if (gapInfo.severity === 'critical') priorityScore += 20;

      recommendedIgot.push({
        ...course,
        matchedGap: gapInfo,
        priority: gapInfo.severity === 'critical' ? 'High' : 'Medium',
        priorityScore,
        relevanceReason: `Remediates gap in "${gapInfo.name}" (Current: L${gapInfo.currentLevel} vs Target: L${gapInfo.targetLevel})`
      });
    }
  });

  // Sort iGOT recommendations by priority
  recommendedIgot.sort((a, b) => b.priorityScore - a.priorityScore);

  // Match NSSTA TPAC Programmes
  NSSTA_TPAC_PROGRAMMES.forEach(prog => {
    const gapInfo = gapMap[prog.competencyId];
    let isCadreMatch = prog.targetCadre.toLowerCase().includes(cadre.toLowerCase()) ||
                       prog.targetCadre.toLowerCase().includes('all') ||
                       prog.targetCadre.toLowerCase().includes('stat');

    if (gapInfo && (gapInfo.severity === 'critical' || gapInfo.severity === 'moderate')) {
      let priority = gapInfo.severity === 'critical' ? 'High' : 'Medium';
      recommendedNssta.push({
        ...prog,
        matchedGap: gapInfo,
        priority,
        relevanceReason: `TPAC recommended residential workshop addressing ${gapInfo.shortName} deficit`
      });
    } else if (isCadreMatch) {
      // General in-service recommendation
      recommendedNssta.push({
        ...prog,
        matchedGap: gapInfo || { shortName: prog.category },
        priority: 'Medium',
        relevanceReason: `TPAC approved in-service programme aligned with your ${cadre} cadre profile`
      });
    }
  });

  // Construct Structured 3-Phase Milestone Pathway
  const phase1Items = []; // Immediate / Critical (Weeks 1-4)
  const phase2Items = []; // Role Enhancement (Weeks 5-10)
  const phase3Items = []; // Strategic Leadership & Emerging Tech (Weeks 11-16)

  recommendedIgot.forEach((course, idx) => {
    if (course.priority === 'High' && phase1Items.length < 3) {
      phase1Items.push({ ...course, type: 'iGOT', phase: 1 });
    } else if (phase2Items.length < 3) {
      phase2Items.push({ ...course, type: 'iGOT', phase: 2 });
    } else {
      phase3Items.push({ ...course, type: 'iGOT', phase: 3 });
    }
  });

  recommendedNssta.forEach((prog, idx) => {
    if (prog.priority === 'High' && phase1Items.length < 4) {
      phase1Items.push({ ...prog, type: 'NSSTA', phase: 1 });
    } else if (phase2Items.length < 4) {
      phase2Items.push({ ...prog, type: 'NSSTA', phase: 2 });
    } else {
      phase3Items.push({ ...prog, type: 'NSSTA', phase: 3 });
    }
  });

  const structuredPathways = [
    {
      phaseNumber: 1,
      title: 'Phase 1: Urgent Foundation & Critical Gap Remediation',
      timeline: 'Weeks 1 to 4',
      badge: 'High Priority',
      color: '#EF4444',
      description: 'Addresses the most severe competency deficits (> 2 levels below target) required for day-to-day statutory responsibilities.',
      items: phase1Items,
      estimatedHours: phase1Items.reduce((acc, i) => acc + (i.durationHours || (i.durationDays * 6) || 0), 0)
    },
    {
      phaseNumber: 2,
      title: 'Phase 2: Advanced Core Competency & Field Analytics',
      timeline: 'Weeks 5 to 10',
      badge: 'Role Enhancement',
      color: '#F59E0B',
      description: 'Expands analytical capability, econometric modeling, and automated data quality validation for promotion readiness.',
      items: phase2Items,
      estimatedHours: phase2Items.reduce((acc, i) => acc + (i.durationHours || (i.durationDays * 6) || 0), 0)
    },
    {
      phaseNumber: 3,
      title: 'Phase 3: Strategic Leadership & Emerging AI Technologies',
      timeline: 'Weeks 11 to 16',
      badge: 'Future Readiness',
      color: '#10B981',
      description: 'Prepares the official for senior leadership, policy formulation, AI/ML adoption, and international statistical standards.',
      items: phase3Items,
      estimatedHours: phase3Items.reduce((acc, i) => acc + (i.durationHours || (i.durationDays * 6) || 0), 0)
    }
  ];

  return {
    gapAnalysis,
    recommendedIgot,
    recommendedNssta,
    structuredPathways,
    totalRecommendedCourses: recommendedIgot.length + recommendedNssta.length
  };
}
