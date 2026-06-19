'use client'
import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { jsPDF } from 'jspdf'

interface DownloadPdfButtonProps {
  monthName: string
}

export default function DownloadPdfButton({ monthName }: DownloadPdfButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    setLoading(true)
    try {
      const doc = new jsPDF()
      let yOffset = 20

      // Title
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(22)
      doc.text(`NewsDigest Magazine — ${monthName}`, 20, yOffset)
      yOffset += 15

      // Subtitle
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(12)
      doc.text('AI-Curated Current Affairs for Competitive Exams (UPSC, PCS, SSC, Banking)', 20, yOffset)
      yOffset += 15

      doc.setLineWidth(0.5)
      doc.line(20, yOffset, 190, yOffset)
      yOffset += 15

      // Get all article sections from the page
      const categorySections = document.querySelectorAll('section[id^="cat-"]')

      if (categorySections.length === 0) {
        doc.setFontSize(14)
        doc.text('No articles available to download.', 20, yOffset)
      } else {
        categorySections.forEach((section) => {
          const categoryTitle = section.querySelector('h2')?.textContent || 'Category'
          
          if (yOffset > 250) {
            doc.addPage()
            yOffset = 20
          }

          doc.setFont('helvetica', 'bold')
          doc.setFontSize(16)
          doc.text(categoryTitle, 20, yOffset)
          yOffset += 10

          const articles = section.querySelectorAll('div[style*="border-left"]')
          articles.forEach((art) => {
            const headline = art.querySelector('a')?.textContent || ''
            const summary = art.querySelector('p')?.textContent || ''
            const score = art.querySelector('span[style*="white-space: nowrap"]')?.textContent || ''

            if (yOffset > 240) {
              doc.addPage()
              yOffset = 20
            }

            doc.setFont('helvetica', 'bold')
            doc.setFontSize(11)
            const splitHeadline = doc.splitTextToSize(`${headline} (${score})`, 170)
            doc.text(splitHeadline, 20, yOffset)
            yOffset += (splitHeadline.length * 6)

            doc.setFont('helvetica', 'normal')
            doc.setFontSize(10)
            const splitSummary = doc.splitTextToSize(summary, 170)
            doc.text(splitSummary, 20, yOffset)
            yOffset += (splitSummary.length * 5) + 8
          })
          
          yOffset += 5
        })
      }

      doc.save(`NewsDigest-${monthName.replace(/\s+/g, '-')}.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="btn btn-primary"
      style={{ gap: '0.5rem', display: 'inline-flex', alignItems: 'center' }}
      aria-label="Download PDF magazine"
    >
      {loading ? (
        <>
          <Loader2 size={18} className="animate-spin" /> Generating PDF...
        </>
      ) : (
        <>
          <Download size={18} /> Download PDF
        </>
      )}
    </button>
  )
}
