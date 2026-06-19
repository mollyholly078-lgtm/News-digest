'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { Clock, CheckCircle, XCircle, ArrowRight, RotateCcw, Trophy } from 'lucide-react'
import type { QuizQuestion } from '@/types'
import Link from 'next/link'
import { saveQuizAttempts } from '@/app/actions/quiz'

interface QuizEngineProps {
  questions: QuizQuestion[]
}

export default function QuizEngine({ questions }: QuizEngineProps) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [timeLeft, setTimeLeft] = useState(15 * 60)
  const [answers, setAnswers] = useState<{ questionId: string; selected: number; correct: boolean }[]>([])
  const [timerActive, setTimerActive] = useState(true)
  const saved = useRef(false)

  const handleFinish = useCallback(() => {
    setFinished(true)
    setTimerActive(false)
  }, [])

  useEffect(() => {
    if (!finished || saved.current) return
    saved.current = true
    saveQuizAttempts(answers).catch(console.error)
  }, [finished, answers])

  useEffect(() => {
    if (!timerActive || finished) return
    const t = setTimeout(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { handleFinish(); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearTimeout(t)
  }, [timeLeft, timerActive, finished, handleFinish])

  function handleSelect(idx: number) {
    if (selected !== null) return
    const q = questions[current]
    const correct = idx === q.correctAnswer
    if (correct) setScore((s) => s + 1)
    setSelected(idx)
    setShowExplanation(true)
    setAnswers((prev) => [...prev, { questionId: q.id, selected: idx, correct }])
  }

  function handleNext() {
    if (current + 1 >= questions.length) { handleFinish(); return }
    setCurrent((c) => c + 1)
    setSelected(null)
    setShowExplanation(false)
  }

  function handleRestart() {
    setCurrent(0); setSelected(null); setShowExplanation(false)
    setScore(0); setFinished(false); setTimeLeft(15 * 60)
    setAnswers([]); setTimerActive(true)
  }

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0')
  const secs = String(timeLeft % 60).padStart(2, '0')
  const pct = Math.round((score / questions.length) * 100)

  if (questions.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--bg-card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
        <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧠</p>
        <h2 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No Questions Yet</h2>
        <p style={{ color: 'var(--text-muted)' }}>Quiz questions will appear here once articles are approved.</p>
      </div>
    )
  }

  if (finished) {
    return (
      <div className="card" style={{ padding: '2.5rem', textAlign: 'center', maxWidth: '560px', margin: '0 auto' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{pct >= 70 ? '🏆' : pct >= 40 ? '📚' : '💪'}</div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          Quiz Complete!
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem', margin: '1.5rem 0' }}>
          <div>
            <p style={{ fontSize: '3rem', fontWeight: 900, color: pct >= 70 ? '#16A34A' : pct >= 40 ? '#D97706' : '#DC2626' }}>{score}/{questions.length}</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Correct</p>
          </div>
          <div style={{ width: '1px', height: '60px', background: 'var(--border)' }} />
          <div>
            <p style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--accent)' }}>{pct}%</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Score</p>
          </div>
          <div style={{ width: '1px', height: '60px', background: 'var(--border)' }} />
          <div>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: `conic-gradient(var(--accent) ${pct * 3.6}deg, var(--border) 0deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Trophy size={24} style={{ color: 'var(--accent)' }} />
              </div>
            </div>
          </div>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', marginBottom: '1.5rem' }}>
          {pct >= 70 ? 'Excellent! You\'re well-prepared.' : pct >= 40 ? 'Good effort! Keep reading more articles.' : 'Keep practicing! Read today\'s top stories.'}
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={handleRestart} className="btn btn-primary" style={{ gap: '0.5rem' }}>
            <RotateCcw size={16} /> Try Again
          </button>
          <Link href="/" className="btn btn-secondary">Read More Articles</Link>
        </div>
      </div>
    )
  }

  const q = questions[current]

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      {/* Timer & Progress */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: timeLeft < 60 ? '#DC2626' : 'var(--text-muted)' }}>
          <Clock size={16} /> {mins}:{secs}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Q {current + 1} / {questions.length}</span>
          <div style={{ width: '120px', height: '6px', background: 'var(--border)', borderRadius: '3px' }}>
            <div style={{ width: `${((current + 1) / questions.length) * 100}%`, height: '100%', background: 'var(--accent)', borderRadius: '3px', transition: 'width 0.4s ease' }} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', fontWeight: 600, color: '#16A34A' }}>
          <CheckCircle size={15} /> {score} correct
        </div>
      </div>

      {/* Question card */}
      <div className="card" style={{ padding: '2rem' }}>
        <span style={{ display: 'inline-block', padding: '0.25rem 0.625rem', background: 'var(--accent-light)', color: 'var(--accent)', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase' }}>
          {q.type}
        </span>
        <p style={{ fontSize: '1.0625rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          {q.question}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '1.25rem' }}>
          {q.options.map((opt, i) => {
            let optStyle: React.CSSProperties = {}
            if (selected !== null) {
              if (i === q.correctAnswer) optStyle = { borderColor: '#16A34A', background: '#F0FDF4', color: '#16A34A' }
              else if (i === selected) optStyle = { borderColor: '#DC2626', background: '#FEF2F2', color: '#DC2626' }
            }
            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={selected !== null}
                className="quiz-option"
                style={{ ...optStyle, textAlign: 'left', font: 'inherit', cursor: selected !== null ? 'default' : 'pointer' }}
              >
                <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8125rem', fontWeight: 700, flexShrink: 0 }}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span style={{ fontSize: '0.9375rem', lineHeight: 1.5 }}>{opt}</span>
                {selected !== null && i === q.correctAnswer && <CheckCircle size={16} style={{ color: '#16A34A', marginLeft: 'auto', flexShrink: 0 }} />}
                {selected !== null && i === selected && i !== q.correctAnswer && <XCircle size={16} style={{ color: '#DC2626', marginLeft: 'auto', flexShrink: 0 }} />}
              </button>
            )
          })}
        </div>

        {showExplanation && q.explanation && (
          <div style={{ background: 'var(--accent-light)', borderRadius: 'var(--radius-sm)', padding: '0.875rem 1rem', marginBottom: '1.25rem', animation: 'fadeIn 0.3s ease' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <span style={{ fontWeight: 700, color: 'var(--accent)' }}>Explanation: </span>
              {q.explanation}
            </p>
          </div>
        )}

        {selected !== null && (
          <button onClick={handleNext} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', gap: '0.5rem' }}>
            {current + 1 >= questions.length ? 'See Results' : 'Next Question'} <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  )
}
