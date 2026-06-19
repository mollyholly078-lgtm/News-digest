import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'; dotenv.config()

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

function slugify(text: string) {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/^-+|-+$/g, '')
}

function makeSlug(text: string) {
  return slugify(text) + '-' + Math.random().toString(36).substring(2, 8)
}

async function main() {
  await prisma.readHistory.deleteMany({})
  await prisma.quizAttempt.deleteMany({})
  await prisma.bookmark.deleteMany({})
  await prisma.quizQuestion.deleteMany({})
  await prisma.relatedArticle.deleteMany({})
  await prisma.article.deleteMany({})
  await prisma.user.deleteMany({})

  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.create({
    data: { name: 'Admin User', email: 'admin@example.com', password: adminPassword, role: 'ADMIN' },
  })
  console.log('Created admin user:', admin.email)

  const userPassword = await bcrypt.hash('user123', 12)
  const user = await prisma.user.create({
    data: { name: 'Test User', email: 'user@example.com', password: userPassword, role: 'USER' },
  })
  console.log('Created test user:', user.email)

  const articlesData = [
    // India
    { headline: 'Centre Launches New Scheme for Farmers', summary: 'Government announced a new scheme to provide direct income support to small and marginal farmers across the country.', background: 'The Union Cabinet has approved a new scheme aimed at providing direct income support to small and marginal farmers. The scheme is expected to benefit over 10 crore farmers nationwide with an annual outlay of ₹75,000 crore.', category: 'india', keywords: ['Government Schemes', 'Agriculture', 'Farmers'], sourceUrl: 'https://example.com/farmer-scheme', sourceName: 'PIB', readingTime: 3, upscScore: 8, featured: true },
    { headline: 'Supreme Court Upholds Right to Privacy in Landmark Judgment', summary: 'Supreme Court reaffirms right to privacy as a fundamental right under Article 21 of the Constitution.', background: 'In a landmark judgment, the Supreme Court of India has upheld the right to privacy as an intrinsic part of the right to life and personal liberty under Article 21. The nine-judge bench ruled unanimously that privacy is a fundamental right protected under the Constitution.', category: 'india', keywords: ['Supreme Court', 'Judiciary', 'Fundamental Rights'], sourceUrl: 'https://example.com/privacy-judgment', sourceName: 'Legal Times', readingTime: 5, upscScore: 9, featured: true },

    // World
    { headline: 'India-EU Free Trade Agreement Talks Resume After Decade', summary: 'India and European Union restart negotiations for a comprehensive free trade agreement after a gap of 10 years.', background: 'India and the European Union have resumed negotiations for the proposed Free Trade Agreement (FTA) after a gap of 10 years. Both sides are aiming for a balanced and comprehensive agreement that covers goods, services, and investment.', category: 'world', keywords: ['Trade Agreements', 'International Relations'], sourceUrl: 'https://example.com/india-eu-fta', sourceName: 'The Diplomat', readingTime: 4, upscScore: 8 },
    { headline: 'India Assumes Presidency of UN Security Council', summary: 'India takes over the rotating presidency of the United Nations Security Council for the month of August.', background: 'India has assumed the rotating presidency of the United Nations Security Council for the month. During its presidency, India will focus on counter-terrorism, peacekeeping, and reforming multilateral institutions.', category: 'world', keywords: ['International Relations', 'Global Organizations'], sourceUrl: 'https://example.com/unsc-presidency', sourceName: 'Global Affairs', readingTime: 3, upscScore: 7 },

    // Economy
    { headline: 'RBI Keeps Repo Rate Unchanged at 6.5%', summary: 'Reserve Bank of India maintains status quo on key policy rates for the sixth consecutive time.', background: 'The Monetary Policy Committee (MPC) of the Reserve Bank of India has decided to keep the repo rate unchanged at 6.5% for the sixth consecutive time. The decision was taken keeping in mind the inflation trajectory and growth objectives.', category: 'economy', keywords: ['RBI', 'Inflation', 'Monetary Policy'], sourceUrl: 'https://example.com/rbi-repo-rate', sourceName: 'Economic Times', readingTime: 3, upscScore: 9 },
    { headline: 'GDP Growth Revised Upward to 7.5% for Current Fiscal', summary: 'India\'s GDP growth for the current fiscal year has been revised upward to 7.5% by the National Statistical Office.', background: 'The National Statistical Office (NSO) has revised India\'s GDP growth projection for the current fiscal year to 7.5%, up from the earlier estimate of 7%. The revision is driven by robust performance in the services and manufacturing sectors.', category: 'economy', keywords: ['GDP', 'Budget', 'Economic Growth'], sourceUrl: 'https://example.com/gdp-growth', sourceName: 'Financial Express', readingTime: 3, upscScore: 8, featured: true },

    // Science & Technology
    { headline: 'ISRO Successfully Tests Reusable Launch Vehicle', summary: 'ISRO achieves a major milestone with the successful landing experiment of its reusable launch vehicle.', background: 'The Indian Space Research Organisation (ISRO) has successfully conducted the landing experiment of its Reusable Launch Vehicle (RLV). This brings India closer to developing a cost-effective and reusable space launch system.', category: 'science-technology', keywords: ['ISRO', 'Space Research', 'Emerging Technologies'], sourceUrl: 'https://example.com/isro-rlv', sourceName: 'Space India', readingTime: 4, upscScore: 9, featured: true },
    { headline: 'India Develops Indigenous 5G Network Equipment', summary: 'Indian researchers have developed fully indigenous 5G network equipment, reducing dependence on foreign technology.', background: 'A team of Indian researchers from IIT Madras has developed indigenous 5G network equipment that meets global standards. The equipment has been successfully tested and is ready for commercial deployment.', category: 'science-technology', keywords: ['Emerging Technologies', 'Cyber Security'], sourceUrl: 'https://example.com/indigenous-5g', sourceName: 'Tech Today', readingTime: 3, upscScore: 7 },

    // Environment
    { headline: 'India Increases Renewable Energy Target to 500 GW by 2030', summary: 'India revises its renewable energy target upwards to 500 GW by 2030, reinforcing its commitment to climate action.', background: 'India has revised its renewable energy target to 500 GW by 2030, up from the previous target of 450 GW. The announcement was made at the COP summit, highlighting India\'s commitment to combating climate change.', category: 'environment', keywords: ['Climate Change', 'Conservation', 'International Environmental Agreements'], sourceUrl: 'https://example.com/renewable-target', sourceName: 'Green News', readingTime: 4, upscScore: 8, featured: true },
    { headline: 'Project Cheetah: First Cheetah Cubs Born in India in 70 Years', summary: 'Four cheetah cubs born in Kuno National Park mark a historic milestone for India\'s cheetah reintroduction project.', background: 'In a historic achievement for India\'s cheetah reintroduction project, four cheetah cubs have been born at Kuno National Park in Madhya Pradesh. This marks the first birth of cheetah cubs on Indian soil in over 70 years since the species went extinct in India.', category: 'environment', keywords: ['Conservation', 'Biodiversity'], sourceUrl: 'https://example.com/cheetah-cubs', sourceName: 'Wildlife Today', readingTime: 3, upscScore: 8 },

    // Polity & Governance
    { headline: 'Understanding the Basic Structure Doctrine of the Constitution', summary: 'The basic structure doctrine is a legal principle that limits Parliament\'s power to amend the Constitution.', background: 'The basic structure doctrine, established in the landmark Kesavananda Bharati case (1973), holds that Parliament cannot amend the basic features of the Constitution. Key features include supremacy of the Constitution, rule of law, separation of powers, judicial review, and federalism.', category: 'polity-governance', keywords: ['Constitution', 'Judiciary'], sourceUrl: 'https://example.com/basic-structure', sourceName: 'Legal Scholars', readingTime: 5, upscScore: 10, featured: true },
    { headline: 'Panchayati Raj Institutions: Empowering Local Governance', summary: 'An overview of the 73rd Constitutional Amendment and the functioning of Panchayati Raj institutions in India.', background: 'The 73rd Constitutional Amendment Act of 1992 gave constitutional status to Panchayati Raj institutions. It established a three-tier system of local self-governance at the village, intermediate, and district levels, with reservations for SCs, STs, and women.', category: 'polity-governance', keywords: ['Local Governance', 'Constitution'], sourceUrl: 'https://example.com/panchayati-raj', sourceName: 'Governance Review', readingTime: 4, upscScore: 9 },
    { headline: 'Right to Information Act: A Tool for Transparent Governance', summary: 'The RTI Act empowers citizens to demand information from public authorities, promoting transparency and accountability.', background: 'The Right to Information (RTI) Act of 2005 is a landmark legislation that empowers citizens to seek information from public authorities. It has been instrumental in exposing corruption, improving governance, and ensuring accountability in the administration.', category: 'polity-governance', keywords: ['Fundamental Rights', 'Governance'], sourceUrl: 'https://example.com/rti-act', sourceName: 'Governance Today', readingTime: 3, upscScore: 8 },
    { headline: 'Role of State Public Service Commissions in Administration', summary: 'State Public Service Commissions play a crucial role in recruitment and maintaining standards in state administration.', background: 'State Public Service Commissions (SPSCs) are constitutional bodies established under Article 315 of the Constitution. They are responsible for conducting examinations and making appointments to state civil services, ensuring merit-based recruitment.', category: 'polity-governance', keywords: ['State Administration', 'Constitution'], sourceUrl: 'https://example.com/spsc-role', sourceName: 'Administration Weekly', readingTime: 3, upscScore: 7 },
    { headline: 'Judicial Review and Its Importance in Indian Democracy', summary: 'Judicial review is the power of courts to examine the constitutionality of legislative and executive actions.', background: 'Judicial review is a fundamental feature of the Indian Constitution that empowers the judiciary to review laws and executive actions for their constitutionality. It acts as a check on legislative and executive power, protecting fundamental rights.', category: 'polity-governance', keywords: ['Judiciary', 'Constitution', 'Fundamental Rights'], sourceUrl: 'https://example.com/judicial-review', sourceName: 'Legal Chronicle', readingTime: 4, upscScore: 9, featured: true },
  ]

  const articles = await Promise.all(
    articlesData.map((a) => {
      const mockMcq = {
        question: `Which of the following best describes the significance of "${a.headline}"?`,
        options: [
          'It has only state-level implications',
          'It represents a major national policy shift',
          'It is primarily of international concern',
          'It affects only the private sector',
        ],
        correct: 1,
        explanation: `The development regarding "${a.headline}" represents a significant national policy decision affecting multiple sectors and stakeholders.`,
      }

      return prisma.article.create({
        data: {
          ...a,
          keywords: JSON.stringify(a.keywords),
          slug: makeSlug(a.headline),
          publishedAt: new Date(),
          approved: true,
          mcqQuestion: JSON.stringify(mockMcq),
        },
      })
    })
  )
  console.log('Created articles:', articles.length)

  // Seed Quiz Questions for the articles
  const quizQuestions = await Promise.all(
    articles.map((art) => {
      const mcq = JSON.parse(art.mcqQuestion)
      return prisma.quizQuestion.create({
        data: {
          articleId: art.id,
          question: mcq.question,
          options: JSON.stringify(mcq.options),
          correctAnswer: mcq.correct,
          explanation: mcq.explanation,
          type: 'MCQ',
        },
      })
    })
  )
  console.log('Created quiz questions:', quizQuestions.length)

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => { console.error('Seed error:', e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
