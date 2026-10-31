import { useEffect } from "react";
import { ArrowIcon } from "../ui/Icons.jsx";

export function QuizScreen({ quiz }) {
  const { questions, index, score, responses, answered, submitAnswer, nextQuestion, endQuiz } = quiz;

  const question = questions[index];
  const total = questions.length;
  const choice = responses[index];
  const isLast = index + 1 === total;

  useEffect(() => {
    function onKeyDown(event) {
      if (event.altKey || event.ctrlKey || event.metaKey || event.repeat) return;
      if (event.target.closest("input, textarea, [contenteditable]")) return;
      if (answered && event.key === "Enter") {
        event.preventDefault();
        nextQuestion();
      } else if (!answered && /^[a-d1-4]$/i.test(event.key)) {
        event.preventDefault();
        const optionIndex = /^[1-4]$/.test(event.key)
          ? Number(event.key) - 1
          : "ABCD".indexOf(event.key.toUpperCase());
        submitAnswer(optionIndex);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [answered, nextQuestion, submitAnswer]);

  if (!question) return null;

  const progress = ((answered ? index + 1 : index) / total) * 100;
  const accuracy = responses.length ? Math.round((score / responses.length) * 100) : 0;
  const correct = choice === question.correct_index;

  return (
    <section className="screen">
      <div className="quiz-header">
        <div>
          <span className="eyebrow accent">Quiz in progress</span>
          <h1>One question at a time.</h1>
        </div>
        <button className="text-button" type="button" onClick={endQuiz}>
          End quiz
        </button>
      </div>

      <div className="quiz-layout">
        <div className="question-card">
          <div className="question-meta">
            <span className="category-badge">{question.category}</span>
            <span className="question-meta-right">
              <span className="compact-score">Score: {score}</span>
              <span className="question-counter">
                Question {index + 1} of {total}
              </span>
            </span>
          </div>
          <div
            className="progress-track"
            role="progressbar"
            aria-label="Quiz progress"
            aria-valuemin="0"
            aria-valuemax={total}
            aria-valuenow={answered ? index + 1 : index}
          >
            <span style={{ width: `${progress}%` }} />
          </div>
          <span className="question-label">The question</span>
          <h2>{question.text}</h2>

          <div className="answer-list" role="group" aria-label="Answer choices">
            {question.options.map((option, optionIndex) => {
              const state = !answered
                ? ""
                : optionIndex === question.correct_index
                  ? " correct"
                  : optionIndex === choice
                    ? " incorrect"
                    : " muted";
              return (
                <button
                  key={option}
                  type="button"
                  className={`answer-button${state}`}
                  disabled={answered}
                  onClick={() => submitAnswer(optionIndex)}
                >
                  <span className="answer-letter" aria-hidden="true">
                    {"ABCD"[optionIndex]}
                  </span>
                  <span>{option}</span>
                </button>
              );
            })}
          </div>

          {answered && (
            <div className={`feedback ${correct ? "good" : "bad"}`} role="status">
              {correct
                ? "Correct! Nicely done."
                : `Not quite. The right answer was: ${question.options[question.correct_index]}`}
            </div>
          )}

          <div className="question-actions">
            <span className="keyboard-hint">
              {answered ? (
                <>
                  Press <kbd>Enter</kbd> to continue
                </>
              ) : (
                <>
                  Press <kbd>A</kbd>–<kbd>D</kbd> or <kbd>1</kbd>–<kbd>4</kbd> to answer
                </>
              )}
            </span>
            {answered && (
              <button className="button primary-button" type="button" onClick={nextQuestion} autoFocus>
                {isLast ? (
                  <>
                    See my results <ArrowIcon className="button-arrow" />
                  </>
                ) : (
                  <>
                    Next question <ArrowIcon className="button-arrow" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <div className="quiz-side">
          <div className="side-card">
            <span className="eyebrow">Your progress</span>
            <div className="side-score">
              <strong>{score}</strong>
              <span>correct so far</span>
            </div>
            <div className="side-divider" />
            <div className="side-stat">
              <span>Answered</span>
              <strong>
                {responses.length} / {total}
              </strong>
            </div>
            <div className="side-stat">
              <span>Accuracy</span>
              <strong>{accuracy}%</strong>
            </div>
          </div>
          <div className="side-note">
            <span>Tip</span>
            <p>
              Choose an answer to get immediate feedback. Missed questions appear in
              your review at the end.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
