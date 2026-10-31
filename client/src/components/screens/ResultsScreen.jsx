import { ArrowIcon } from "../ui/Icons.jsx";
import { ScoreRing } from "../ui/ScoreRing.jsx";

function resultMessage(percentage) {
  if (percentage >= 90) return "Excellent work!";
  if (percentage >= 70) return "Good job!";
  return "Keep practicing!";
}

export function ResultsScreen({ quiz }) {
  const { questions, score, responses, category, playAgain, backToSetup } = quiz;
  const total = questions.length;
  const percentage = total ? (score / total) * 100 : 0;

  const missed = questions
    .map((question, index) => ({ question, index }))
    .filter(({ question, index }) => responses[index] !== question.correct_index);

  return (
    <section className="screen">
      <div className="results-hero">
        <span className="pill">
          <span className="pill-dot" aria-hidden="true" /> Session complete
        </span>
        <div className="results-layout">
          <div>
            <h1 tabIndex={-1}>{resultMessage(percentage)}</h1>
            <p>
              You got {score} out of {total} right. Every question counts.
            </p>
            <div className="result-actions">
              <button className="button primary-button" type="button" onClick={playAgain}>
                Try another round <ArrowIcon className="button-arrow" />
              </button>
              <button className="button secondary-button" type="button" onClick={backToSetup}>
                Choose a topic
              </button>
            </div>
          </div>
          <ScoreRing percent={percentage} />
        </div>
      </div>

      <div className="result-stats">
        <div>
          <span>Correct answers</span>
          <strong>{score}</strong>
        </div>
        <div>
          <span>Questions played</span>
          <strong>{total}</strong>
        </div>
        <div>
          <span>Topic</span>
          <strong className="result-topic-name">{category}</strong>
        </div>
      </div>

      {missed.length > 0 && (
        <div className="review-panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow accent">Learn from your answers</span>
              <h2>Questions to revisit</h2>
            </div>
          </div>
          {missed.map(({ question, index }) => (
            <div className="review-item" key={index}>
              <strong>
                {index + 1}. {question.text}
              </strong>
              <span>Your answer: {question.options[responses[index]] ?? "—"}</span>
              <span className="review-correct">
                Correct answer: {question.options[question.correct_index]}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
