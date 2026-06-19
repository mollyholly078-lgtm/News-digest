'use server'
import { prisma } from '@/lib/prisma'
import { fetchNewsFromRSS } from '@/lib/news-fetcher'
import { generateArticleContent } from '@/lib/gemini'
import { slugify } from '@/lib/utils'
import { revalidatePath } from 'next/cache'

export async function triggerNewsFetch() {
  try {
    const rawItems = await fetchNewsFromRSS()
    
    // Process up to 5 items through the AI pipeline
    const itemsToProcess = rawItems.slice(0, 5)
    let processedCount = 0
    let skippedCount = 0

    for (const item of itemsToProcess) {
      // Check for existing article by guid (dedup key) — skip AI call if already stored
      const existing = await prisma.article.findUnique({ where: { guid: item.guid } })
      if (existing) {
        skippedCount++
        continue
      }

      // Generate AI Structured Content
      const aiContent = await generateArticleContent(item.headline, item.content)

      if (aiContent) {
        const slug = slugify(item.headline) + '-' + Date.now().toString().slice(-4)
        // upsert keyed on guid — safe to call multiple times without creating duplicates
        await prisma.article.upsert({
          where: { guid: item.guid },
          create: {
            guid: item.guid,
            slug,
            headline: item.headline,
            summary: aiContent.summary,
            background: aiContent.background,
            whyItMatters: aiContent.whyItMatters,
            keyFacts: JSON.stringify(aiContent.keyFacts),
            mcqQuestion: JSON.stringify(aiContent.mcqQuestion),
            mainsQuestion: aiContent.mainsQuestion,
            keywords: JSON.stringify(aiContent.keywords),
            category: item.category,
            upscScore: aiContent.upscScore,
            readingTime: 3,
            sourceUrl: item.sourceUrl,
            sourceName: item.sourceName,
            approved: false,
            featured: false,
            publishedAt: item.publishedAt, // actual RSS pubDate — never now()
          },
          update: {
            // On conflict, only refresh the headline and publishedAt in case the
            // feed updated the item — never touch approved/featured flags
            headline: item.headline,
            publishedAt: item.publishedAt,
          },
        })
        processedCount++
      } else {
        skippedCount++
      }
    }

    revalidatePath('/admin')
    revalidatePath('/admin/articles')
    revalidatePath('/')
    
    return {
      success: true,
      message: `Processed ${processedCount} new items. ${skippedCount} already exist or skipped.`,
    }
  } catch (error) {
    console.error('Trigger news fetch error:', error)
    return { error: 'Failed to complete news fetch pipeline.' }
  }
}

export async function approveArticle(id: string) {
  try {
    const article = await prisma.article.update({
      where: { id },
      data: { approved: true }
    })
    
    if (article.mcqQuestion) {
      try {
        const mcq = JSON.parse(article.mcqQuestion)
        if (mcq && mcq.question && Array.isArray(mcq.options) && mcq.options.length > 0) {
          // Check if QuizQuestion already exists for this article to avoid duplicates
          const existing = await prisma.quizQuestion.findFirst({
            where: { articleId: id }
          })
          if (!existing) {
            await prisma.quizQuestion.create({
              data: {
                articleId: id,
                question: mcq.question,
                options: JSON.stringify(mcq.options),
                correctAnswer: typeof mcq.correct === 'number' ? mcq.correct : 0,
                explanation: mcq.explanation || '',
                type: 'MCQ'
              }
            })
          }
        }
      } catch (e) {
        console.error('Failed to create quiz question during article approval:', e)
      }
    }
    
    revalidatePath('/admin')
    revalidatePath('/admin/articles')
    revalidatePath('/')
    return { success: true }
  } catch (err) {
    console.error('Approve article error:', err)
    return { error: 'Failed to approve article.' }
  }
}

export async function deleteArticle(id: string) {
  try {
    await prisma.article.delete({
      where: { id }
    })
    
    revalidatePath('/admin')
    revalidatePath('/admin/articles')
    revalidatePath('/')
    return { success: true }
  } catch (err) {
    console.error('Delete article error:', err)
    return { error: 'Failed to delete article.' }
  }
}
