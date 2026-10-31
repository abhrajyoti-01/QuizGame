import { ArrowIcon, CheckIcon, LayersIcon } from "../ui/Icons.jsx";

const STEPS = [
  { number: "01", title: "Pick a subject", detail: "Choose from the topic list" },
  { number: "02", title: "Set your length", detail: "Answer as many as you like" },
  { number: "03", title: "Review results", detail: "See your score and corrections" },
];

export function SetupScreen({ quiz }) {
  const {
    bank,
    loading,
    error,
    category,
    pool,
    topicCounts,
    count,
    setQuestionCount,
    countError,
    startQuiz,
  } = quiz;

  const available = pool.length;
  const quickChoices = [5, 10, 20, 50].filter((n) => n <= available);
  if (available && available < 5) quickChoices.push(available);

  const step = (delta) => {
    const current = Number(count) > 0 ? Number(count) : 1;
    setQuestionCount(Math.max(1, Math.min(available || 1, current + delta)));
  };

  return (
    <section className="screen">
      <div className="hero">
        <div className="hero-copy">
          <h1>
            Test what you know.
            <br />
            <em>Discover what's next.</em>
          </h1>
          <p>
            A focused quiz space for students. Pick a subject, choose your question
            count, and learn from every answer.
          </p>
          <div className="hero-meta">
            <span>
              <strong>{bank.length ? bank.length.toLocaleString() : "--"}</strong> questions
            </span>
            <span className="meta-separator" />
            <span>
              <strong>{topicCounts.size > 1 ? topicCounts.size - 1 : "--"}</strong> topics
            </span>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="tile-grid">
            <span className="tile tile-question">?</span>
            <span className="tile tile-letter">A</span>
            <span className="tile tile-letter">B</span>
            <span className="tile tile-check">
              <CheckIcon size={26} />
            </span>
          </div>
        </div>
      </div>

      <div className="how-it-works" aria-label="How the quiz works">
        {STEPS.map((stepItem) => (
          <div key={stepItem.number}>
            <span className="step-number">{stepItem.number}</span>
            <div>
              <strong>{stepItem.title}</strong>
              <span>{stepItem.detail}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="section-heading">
        <div>
          <span className="eyebrow accent">Get started</span>
          <h2>Set up your quiz</h2>
        </div>
        <span className="section-hint">
          Select a topic on the left, then set your question count.
        </span>
      </div>

      <div className="setup-grid">
        <div className="panel topic-panel">
          <div className="panel-number">Your subject</div>
          <div className="selected-topic-icon" aria-hidden="true">
            <LayersIcon />
          </div>
          <h3>{category}</h3>
          <p>
            {category === "Mixed topics"
              ? "Questions from every subject in the bank."
              : `Practise ${category} with a new selection each round.`}
          </p>
          <div className="selected-topic-footer">
            <span className="tiny-dot" aria-hidden="true" />
            <span>
              {error
                ? error
                : loading
                  ? "Loading questions..."
                  : `${available.toLocaleString()} questions available`}
            </span>
          </div>
        </div>

        <div className="panel count-panel">
          <div className="panel-number">Your quiz length</div>
          <h3>How many questions?</h3>
          <p>Choose a quick round or practise the whole topic.</p>
          <div className="count-controls">
            <button className="count-step" type="button" aria-label="One fewer question" onClick={() => step(-1)}>
              −
            </button>
            <label className="count-field">
              <span className="sr-only">Number of questions</span>
              <input
                type="number"
                min="1"
                inputMode="numeric"
                value={count}
                aria-invalid={countError ? "true" : "false"}
                aria-describedby="count-error"
                onChange={(event) =>
                  setQuestionCount(event.target.value === "" ? "" : Number(event.target.value))
                }
              />
            </label>
            <button className="count-step" type="button" aria-label="One more question" onClick={() => step(1)}>
              +
            </button>
            <span className="count-unit">questions</span>
          </div>
          {countError && (
            <p className="field-error" id="count-error" role="alert">
              {countError}
            </p>
          )}
          <div className="quick-counts" aria-label="Quick question counts">
            <span>Quick pick</span>
            <div className="quick-buttons">
              {quickChoices.map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`quick-button${Number(count) === n ? " active" : ""}`}
                  aria-label={`${n} questions`}
                  onClick={() => setQuestionCount(n)}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="start-row">
        <p>
          <span className="check-icon" aria-hidden="true">
            <CheckIcon />
          </span>
          Questions are shuffled, with no repeats in a round.
        </p>
        <button
          className="button primary-button"
          type="button"
          disabled={loading || !available}
          onClick={startQuiz}
        >
          {loading ? "Loading questions..." : (
            <>
              Start quiz <ArrowIcon className="button-arrow" />
            </>
          )}
        </button>
      </div>
    </section>
  );
}
