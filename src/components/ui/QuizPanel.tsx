'use client';

import { useState, useCallback } from 'react';
import { CheckCircle2, XCircle, RefreshCw, HelpCircle } from 'lucide-react';
import { QUIZ_DATA } from '@/data/quizData';
import type { QuizQuestion } from '@/data/quizData';

interface QuizPanelProps {
  slug: string;
}

type AnswerState = number | null; // index of chosen option, or null

export function QuizPanel({ slug }: QuizPanelProps) {
  const questions: QuizQuestion[] | undefined = QUIZ_DATA[slug];

  const [answers, setAnswers] = useState<AnswerState[]>(
    questions ? new Array(questions.length).fill(null) : []
  );
  const [submitted, setSubmitted] = useState(false);
  const [showExplanations, setShowExplanations] = useState(false);

  const reset = useCallback(() => {
    setAnswers(questions ? new Array(questions.length).fill(null) : []);
    setSubmitted(false);
    setShowExplanations(false);
  }, [questions]);

  if (!questions || questions.length === 0) {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-warm)] p-8 text-center text-[var(--ink-3)]">
        <HelpCircle size={24} className="mx-auto mb-2 opacity-40" />
        <p className="text-sm">Quiz coming soon for this algorithm.</p>
      </div>
    );
  }

  const score = submitted
    ? answers.filter((a, i) => a === questions[i].correctIndex).length
    : 0;

  const allAnswered = answers.every(a => a !== null);

  return (
    <div className="space-y-5">
      {questions.map((q, qi) => {
        const chosen = answers[qi];
        const isCorrect = submitted && chosen === q.correctIndex;
        const isWrong = submitted && chosen !== null && chosen !== q.correctIndex;

        return (
          <div
            key={qi}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden"
          >
            {/* Question header */}
            <div className="px-5 py-4 border-b border-[var(--border)] bg-[var(--bg-warm)] flex items-start gap-3">
              <span className="text-xs font-mono text-[var(--ink-4)] mt-0.5 shrink-0">{qi + 1}.</span>
              <p className="text-sm font-medium text-[var(--ink)] leading-snug">{q.question}</p>
              {submitted && (
                <div className="ml-auto shrink-0">
                  {isCorrect
                    ? <CheckCircle2 size={16} className="text-[var(--emerald,#10b981)]" />
                    : <XCircle size={16} className="text-[var(--red,#ef4444)]" />
                  }
                </div>
              )}
            </div>

            {/* Options */}
            <div className="px-5 py-4 space-y-2">
              {q.options.map((opt, oi) => {
                let style = 'border-[var(--border)] bg-[var(--surface)] text-[var(--ink-2)]';
                if (submitted) {
                  if (oi === q.correctIndex) {
                    style = 'border-[var(--emerald,#10b981)] bg-[var(--emerald-bg)] text-[var(--emerald,#10b981)]';
                  } else if (oi === chosen) {
                    style = 'border-[var(--red,#ef4444)] bg-[#fee2e2] text-[var(--red,#ef4444)]';
                  }
                } else if (oi === chosen) {
                  style = 'border-[var(--accent)] bg-[var(--accent-bg)] text-[var(--accent)]';
                }

                return (
                  <button
                    key={oi}
                    disabled={submitted}
                    onClick={() => {
                      const next = [...answers];
                      next[qi] = oi;
                      setAnswers(next);
                    }}
                    className={`w-full text-left text-sm px-3 py-2.5 rounded-lg border-2 transition-all duration-100 disabled:cursor-default ${style}`}
                  >
                    <span className="font-mono text-[10px] mr-2 opacity-60">
                      {String.fromCharCode(65 + oi)}.
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {submitted && (showExplanations || isWrong) && (
              <div className="px-5 pb-4">
                <p className="text-xs text-[var(--ink-3)] leading-relaxed border-l-2 border-[var(--border)] pl-3">
                  {q.explanation}
                </p>
              </div>
            )}
          </div>
        );
      })}

      {/* Footer controls */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {!submitted ? (
          <button
            onClick={() => setSubmitted(true)}
            disabled={!allAnswered}
            className="px-5 py-2 rounded-xl bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-dark)] transition-colors disabled:opacity-40"
          >
            Submit Quiz
          </button>
        ) : (
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-[var(--ink)]">
                Score: {score}/{questions.length}
              </span>
              <span className="text-xs text-[var(--ink-3)]">
                ({Math.round((score / questions.length) * 100)}%)
              </span>
            </div>
            <button
              onClick={() => setShowExplanations(p => !p)}
              className="text-xs text-[var(--accent)] hover:underline"
            >
              {showExplanations ? 'Hide explanations' : 'Show all explanations'}
            </button>
            <button
              onClick={reset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--ink-3)] hover:text-[var(--ink)] transition-colors"
            >
              <RefreshCw size={12} /> Retry
            </button>
          </div>
        )}
        {!submitted && (
          <span className="text-xs text-[var(--ink-4)]">
            {answers.filter(a => a !== null).length}/{questions.length} answered
          </span>
        )}
      </div>
    </div>
  );
}
