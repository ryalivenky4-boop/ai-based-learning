// Competency Assessment and Skill-Gap Analysis Engine for MoSPI Trainees

import { COMPETENCIES, DOMAINS, DOMAIN_METADATA } from '../data/competencyFramework';
import { ROLES_CONFIG } from '../data/officialProfiles';

/**
 * Computes detailed skill gaps comparing an official's current scores against a target role's benchmark.
 * @param {Object} currentScores - Map of competencyId to proficiency level (1-5)
 * @param {string} targetRoleKey - Key of target role (e.g. 'jso', 'sso', 'asst_dir', 'dep_dir')
 */
export function analyzeCompetencyGaps(currentScores = {}, targetRoleKey = 'sso') {
  const gaps = [];
  const domainTotals = {
    [DOMAINS.STATISTICAL]: { currentSum: 0, targetSum: 0, count: 0 },
    [DOMAINS.TECHNICAL]: { currentSum: 0, targetSum: 0, count: 0 },
    [DOMAINS.DIGITAL_GOVERNANCE]: { currentSum: 0, targetSum: 0, count: 0 },
    [DOMAINS.BEHAVIOURAL]: { currentSum: 0, targetSum: 0, count: 0 }
  };

  COMPETENCIES.forEach(comp => {
    const current = currentScores[comp.id] || 1;
    const target = comp.benchmark[targetRoleKey] || comp.benchmark.sso || 3;
    const gap = Math.max(0, target - current);
    const surplus = Math.max(0, current - target);

    let severity = 'proficient';
    if (gap >= 2) severity = 'critical';
    else if (gap === 1) severity = 'moderate';
    else if (surplus > 0) severity = 'exceeds';

    gaps.push({
      competencyId: comp.id,
      name: comp.name,
      shortName: comp.shortName,
      domain: comp.domain,
      description: comp.description,
      currentLevel: current,
      targetLevel: target,
      gap,
      severity,
      domainMeta: DOMAIN_METADATA[comp.domain]
    });

    if (domainTotals[comp.domain]) {
      domainTotals[comp.domain].currentSum += current;
      domainTotals[comp.domain].targetSum += target;
      domainTotals[comp.domain].count += 1;
    }
  });

  // Calculate domain-level readiness percentages
  const domainSummaries = Object.keys(domainTotals).map(domainKey => {
    const data = domainTotals[domainKey];
    const avgCurrent = data.count ? (data.currentSum / data.count) : 0;
    const avgTarget = data.count ? (data.targetSum / data.count) : 0;
    const percentage = avgTarget > 0 ? Math.min(100, Math.round((avgCurrent / avgTarget) * 100)) : 100;

    return {
      domain: domainKey,
      title: DOMAIN_METADATA[domainKey].title,
      shortTitle: DOMAIN_METADATA[domainKey].shortTitle,
      color: DOMAIN_METADATA[domainKey].color,
      bgLight: DOMAIN_METADATA[domainKey].bgLight,
      avgCurrent: parseFloat(avgCurrent.toFixed(1)),
      avgTarget: parseFloat(avgTarget.toFixed(1)),
      readinessPercentage: percentage,
      criticalGapsCount: gaps.filter(g => g.domain === domainKey && g.severity === 'critical').length,
      moderateGapsCount: gaps.filter(g => g.domain === domainKey && g.severity === 'moderate').length
    };
  });

  // Overall readiness index (0-100%)
  const totalCurrent = Object.values(domainTotals).reduce((sum, d) => sum + d.currentSum, 0);
  const totalTarget = Object.values(domainTotals).reduce((sum, d) => sum + d.targetSum, 0);
  const overallReadiness = totalTarget > 0 ? Math.min(100, Math.round((totalCurrent / totalTarget) * 100)) : 100;

  const criticalGaps = gaps.filter(g => g.severity === 'critical');
  const moderateGaps = gaps.filter(g => g.severity === 'moderate');

  return {
    targetRole: ROLES_CONFIG[targetRoleKey] || { title: targetRoleKey },
    overallReadiness,
    totalCompetencies: COMPETENCIES.length,
    criticalGapsCount: criticalGaps.length,
    moderateGapsCount: moderateGaps.length,
    proficientCount: gaps.filter(g => g.severity === 'proficient' || g.severity === 'exceeds').length,
    gaps,
    criticalGaps,
    moderateGaps,
    domainSummaries
  };
}
