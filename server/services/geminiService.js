import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../..', '.env') });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

/**
 * Calls Gemini API if key is configured, else falls back to domain engine
 */
async function callGemini(prompt, systemInstruction = '') {
  if (!GEMINI_API_KEY) {
    return null;
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const payload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: 'application/json'
      }
    };

    if (systemInstruction) {
      payload.systemInstruction = {
        parts: [{ text: systemInstruction }]
      };
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.warn(`Gemini API returned status ${response.status}`);
      return null;
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;
    return JSON.parse(text);
  } catch (err) {
    console.warn('Gemini API call failed, using intelligent fallback:', err.message);
    return null;
  }
}

/**
 * 1. AI Competency Gap Analysis: Compares user's current skills against target skills and job role
 */
export async function analyzeCompetencyGapsWithAI(user, userSkills, targetSkills) {
  // Try Gemini AI first if configured
  if (GEMINI_API_KEY) {
    const prompt = `
You are an expert AI Competency Analyst for India's Official Statistical System (MoSPI & iGOT Karmayogi).
Analyze the following official's profile and skills:
User: ${user.full_name}
Job Role: ${user.job_role || 'Statistical Officer'}
Department: ${user.department || 'Official Statistics'}
Career Goal: ${user.career_goal || 'Advance in official statistics and data science'}

Current Skills:
${JSON.stringify(userSkills, null, 2)}

Target Skills:
${JSON.stringify(targetSkills, null, 2)}

Return a JSON array of competency gaps. Each object must have:
- skill_name: string
- current_score: number (0-100)
- target_score: number (0-100)
- gap_score: number (target_score - current_score)
- priority: "High" | "Medium" | "Low"
- ai_reason: string (detailed reasoning considering their role and goal)
`;
    const aiResult = await callGemini(prompt, 'You are an AI workforce capacity building engine.');
    if (Array.isArray(aiResult) && aiResult.length > 0) {
      return aiResult;
    }
  }

  // Domain-Aware Deterministic Analysis Engine
  const gaps = [];
  const currentSkillsMap = {};
  userSkills.forEach(s => {
    currentSkillsMap[s.skill_name.toLowerCase()] = s.proficiency_score || 40;
  });

  targetSkills.forEach(ts => {
    const skillLower = ts.skill_name.toLowerCase();
    const currentScore = currentSkillsMap[skillLower] || 25;
    const targetScore = ts.priority === 'High' ? 85 : ts.priority === 'Medium' ? 75 : 65;
    const gapScore = Math.max(0, targetScore - currentScore);

    let priority = ts.priority || 'Medium';
    if (gapScore >= 40) priority = 'High';
    else if (gapScore <= 15) priority = 'Low';

    gaps.push({
      skill_name: ts.skill_name,
      current_score: currentScore,
      target_score: targetScore,
      gap_score: gapScore,
      priority,
      ai_reason: `To achieve your goal of "${user.career_goal || 'advancing your role in ' + (user.department || 'MoSPI')}", elevating ${ts.skill_name} from ${currentScore}% to ${targetScore}% is essential for official data governance.`
    });
  });

  // Also inspect any current skill with score < 50
  userSkills.forEach(s => {
    const isAlreadyInTarget = targetSkills.some(ts => ts.skill_name.toLowerCase() === s.skill_name.toLowerCase());
    if (!isAlreadyInTarget && (s.proficiency_score || 40) < 50) {
      const currentScore = s.proficiency_score || 40;
      const targetScore = 70;
      gaps.push({
        skill_name: s.skill_name,
        current_score: currentScore,
        target_score: targetScore,
        gap_score: targetScore - currentScore,
        priority: 'Medium',
        ai_reason: `Current proficiency in ${s.skill_name} (${currentScore}%) is below the MoSPI benchmark for ${user.job_role || 'statistical personnel'}.`
      });
    }
  });

  return gaps;
}

/**
 * 2. AI Personalized Recommendations: Matches identified gaps and user profile against available courses
 */
export async function generateRecommendationsWithAI(user, gaps, availableCourses) {
  if (GEMINI_API_KEY && gaps.length > 0) {
    const prompt = `
Given the user:
Name: ${user.full_name}, Role: ${user.job_role}, Department: ${user.department}
Gaps: ${JSON.stringify(gaps)}
Courses Pool: ${JSON.stringify(availableCourses.map(c => ({ id: c.id, title: c.title, skill: c.skill, provider: c.provider, source: c.source })))}

Recommend the top matching courses to close these competency gaps.
Return a JSON array of objects:
- course_id: string
- skill: string
- reason: string
- priority: "High" | "Medium" | "Low"
- recommendation_score: number (0-100)
`;
    const aiResult = await callGemini(prompt);
    if (Array.isArray(aiResult) && aiResult.length > 0) {
      return aiResult;
    }
  }

  // Intelligent Recommendation Heuristic
  const recommendations = [];
  const gapSkills = gaps.map(g => g.skill_name.toLowerCase());

  availableCourses.forEach(course => {
    const cTitle = (course.title || '').toLowerCase();
    const cSkill = (course.skill || '').toLowerCase();
    const cDesc = (course.description || '').toLowerCase();

    for (const gap of gaps) {
      const gSkill = gap.skill_name.toLowerCase();
      if (cTitle.includes(gSkill) || cSkill.includes(gSkill) || cDesc.includes(gSkill)) {
        recommendations.push({
          course_id: course.id,
          skill: gap.skill_name,
          reason: `Addresses critical competency gap in ${gap.skill_name} (Gap score: ${gap.gap_score} pts). Recommended by Karmayogi capacity framework for ${user.job_role || 'your role'}.`,
          priority: gap.priority,
          recommendation_score: Math.min(98, 70 + (gap.gap_score * 0.5))
        });
        break;
      }
    }
  });

  // If few direct matches, include top sample courses
  if (recommendations.length < 3) {
    availableCourses.slice(0, 4).forEach(c => {
      if (!recommendations.some(r => r.course_id === c.id)) {
        recommendations.push({
          course_id: c.id,
          skill: c.skill || 'Official Statistics',
          reason: `Core capacity building course recommended for ${user.department || 'MoSPI'} personnel.`,
          priority: 'Medium',
          recommendation_score: 75.0
        });
      }
    });
  }

  return recommendations;
}

/**
 * 3. AI Quiz Generation: Generates objective questions from uploaded learning material text
 */
export async function generateQuizFromMaterialWithAI(materialText, title = 'Uploaded Material', difficulty = 'Medium', totalQuestions = 5) {
  if (GEMINI_API_KEY && materialText && materialText.trim().length > 100) {
    const prompt = `
Extract ${totalQuestions} high-quality multiple choice questions (MCQs) from the following learning material.
Difficulty: ${difficulty}
Title: ${title}

Material Text:
${materialText.substring(0, 5000)}

Return a JSON array of questions with format:
[
  {
    "question": "Question text?",
    "option_a": "First option",
    "option_b": "Second option",
    "option_c": "Third option",
    "option_d": "Fourth option",
    "correct_answer": "A" | "B" | "C" | "D",
    "explanation": "Explanation of why this answer is correct based on the text."
  }
]
`;
    const aiResult = await callGemini(prompt);
    if (Array.isArray(aiResult) && aiResult.length > 0) {
      return aiResult;
    }
  }

  // Robust Text Extraction & Heuristic MCQ Synthesizer
  const questions = [];
  const sentences = materialText
    .split(/[.\n]/)
    .map(s => s.trim())
    .filter(s => s.length > 40 && s.length < 250);

  const defSentences = sentences.filter(s =>
    /\b(is defined as|refers to|means|consists of|calculated as|includes|formula|comprises)\b/i.test(s)
  );

  defSentences.slice(0, totalQuestions).forEach((sentence, idx) => {
    const parts = sentence.split(/\b(?:is defined as|refers to|means|consists of|calculated as|comprises)\b/i);
    if (parts.length === 2 && parts[0].trim().length > 4) {
      const subject = parts[0].trim().replace(/^[-•\d.\s]+/, '');
      const definition = parts[1].trim();

      questions.push({
        question: `According to "${title}", how is "${subject}" formally defined or calculated?`,
        option_a: definition.charAt(0).toUpperCase() + definition.slice(1),
        option_b: 'An arbitrary parameter determined without statistical sampling procedures.',
        option_c: 'An unweighted composite indicator excluded from national accounts.',
        option_d: 'A deprecated administrative metric replaced under modern statistical reforms.',
        correct_answer: 'A',
        explanation: `As stated in ${title}: "${sentence}".`
      });
    }
  });

  // Supplement if needed
  if (questions.length < totalQuestions) {
    const fallbackBank = [
      {
        question: `What is the primary objective of data quality frameworks in official statistics?`,
        option_a: 'To maximize commercial revenue from data sales',
        option_b: 'To ensure relevance, accuracy, timeliness, accessibility, and credibility of statistical outputs',
        option_c: 'To replace field enumerators with unvalidated automated scraping',
        option_d: 'To restrict public access to macroeconomic data',
        correct_answer: 'B',
        explanation: 'Data quality frameworks (like MoSPI DQAF and UN-NQAF) govern statistical integrity across accuracy, timeliness, and user relevance.'
      },
      {
        question: `Under the Collection of Statistics Act 2008, how is respondent information protected?`,
        option_a: 'All individual returns are published in public newspapers',
        option_b: 'Data is strictly confidential and cannot be disclosed as individual identifiable records',
        option_c: 'Information is shared directly with competitor businesses',
        option_d: 'Respondent identity is shared without consent across social media',
        correct_answer: 'B',
        explanation: 'Section 9 of the Collection of Statistics Act 2008 strictly forbids the disclosure of individual unit records to protect respondent privacy.'
      },
      {
        question: `In sampling theory, what does a stratified multi-stage sampling design achieve?`,
        option_a: 'Guarantees 100% census enumeration without sampling errors',
        option_b: 'Improves representation across diverse geographic and socio-economic strata while optimizing field logistics',
        option_c: 'Eliminates the need for sampling weights and multipliers',
        option_d: 'Restricts survey collection to capital cities only',
        correct_answer: 'B',
        explanation: 'Stratification reduces sampling variance by grouping homogeneous units, while multi-stage clustering optimizes surveyor travel and administrative feasibility.'
      },
      {
        question: `Which methodology does MoSPI utilize for the Periodic Labour Force Survey (PLFS) in urban areas?`,
        option_a: 'Single-visit census enumeration',
        option_b: 'Rotational panel sampling with 75% quarter-to-quarter sample household overlap',
        option_c: 'Voluntary online self-reporting surveys only',
        option_d: 'Telephone interviews using random digit dialing',
        correct_answer: 'B',
        explanation: 'In urban areas, PLFS adopts a rotational panel design where each selected UFS block is visited four times, providing 75% sample overlap across quarters.'
      },
      {
        question: `Under SNA 2008, what connects GVA at Basic Prices with GDP at Market Prices?`,
        option_a: 'GDP = GVA + Product Taxes - Product Subsidies',
        option_b: 'GDP = GVA - Total Imports',
        option_c: 'GDP = GVA / Inflation Deflator',
        option_d: 'GDP = GVA - Net Capital Formation',
        correct_answer: 'A',
        explanation: 'GDP at Market Prices equals the sum of GVA at Basic Prices plus product taxes (such as GST and customs) minus product subsidies (such as food and fertilizer subsidies).'
      }
    ];

    while (questions.length < totalQuestions && fallbackBank.length > 0) {
      questions.push(fallbackBank.shift());
    }
  }

  return questions;
}
