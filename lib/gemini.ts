import { GoogleGenerativeAI } from '@google/generative-ai'
import type { MCQQuestion } from '@/types'

const apiKey = process.env.GOOGLE_AI_API_KEY ?? ''

export interface AIArticleContent {
  summary: string
  background: string
  whyItMatters: string
  keyFacts: string[]
  mcqQuestion: MCQQuestion
  mainsQuestion: string
  keywords: string[]
  upscScore: number
}

export async function generateArticleContent(
  headline: string,
  rawContent: string,
): Promise<AIArticleContent | null> {
  if (!apiKey) return getMockContent(headline)

  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `You are an expert UPSC educator. Given this news article, generate structured content for competitive exam aspirants.

HEADLINE: ${headline}
CONTENT: ${rawContent.slice(0, 3000)}

Respond ONLY with valid JSON in this exact format:
{
  "summary": "100-word plain English summary",
  "background": "150-word background/context for beginners",
  "whyItMatters": "100-word explanation of exam relevance",
  "keyFacts": ["fact 1", "fact 2", "fact 3", "fact 4", "fact 5"],
  "mcqQuestion": {
    "question": "MCQ question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": 0,
    "explanation": "Why this answer is correct"
  },
  "mainsQuestion": "One descriptive Mains question",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "upscScore": 7
}`

    const result = await model.generateContent(prompt)
    const text = result.response.text()
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return getMockContent(headline)
    return JSON.parse(jsonMatch[0]) as AIArticleContent
  } catch (err) {
    console.error('Gemini API error:', err)
    return getMockContent(headline)
  }
}

function getMockContent(headline: string): AIArticleContent {
  return {
    summary: `This article covers ${headline}. The development has significant implications for India's policy landscape and competitive exam preparation. Students should understand the key aspects, stakeholders involved, and the broader impact on governance and society.`,
    background: `To understand this development, it is important to know the historical context and the institutional framework governing this area. India has a robust constitutional and legislative framework that shapes such decisions. The relevant ministries, regulatory bodies, and international organizations play crucial roles in this domain.`,
    whyItMatters: `This topic is highly relevant for UPSC Prelims and Mains examinations. It touches upon GS Paper 2 (Governance) and GS Paper 3 (Economy/Environment). Questions based on this can appear in both objective and descriptive formats. Understanding the policy implications is essential.`,
    keyFacts: [
      'This is a significant policy development with national implications',
      'Multiple government ministries and departments are involved',
      'Constitutional and legal frameworks govern this area',
      'International cooperation may be required for implementation',
      'Civil society and stakeholders have varying perspectives',
    ],
    mcqQuestion: {
      question: `Which of the following best describes the significance of "${headline.slice(0, 60)}"?`,
      options: [
        'It has only state-level implications',
        'It represents a major national policy shift',
        'It is primarily of international concern',
        'It affects only the private sector',
      ],
      correct: 1,
      explanation: 'This development represents a significant national policy decision affecting multiple sectors and stakeholders across India.',
    },
    mainsQuestion: `Discuss the significance of recent developments in this area. How does it impact India's governance framework and what measures should be taken for effective implementation? (250 words)`,
    keywords: ['Policy', 'Governance', 'India', 'Development', 'Reform'],
    upscScore: 7,
  }
}
