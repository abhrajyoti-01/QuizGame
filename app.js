"use strict";

const $ = (id) => document.getElementById(id);
const state = {
  bank: [],
  category: "Mixed topics",
  questions: [],
  index: 0,
  score: 0,
  responses: [],
  answered: false,
  screen: "setup",
};

function topics() {
  return [...new Set(state.bank.map((question) => question.category))];
}

function pool() {
  return state.category === "Mixed topics"
    ? state.bank
    : state.bank.filter((question) => question.category === state.category);
}

function showScreen(name) {
  for (const screen of ["setup", "quiz", "results"]) {
    $(`${screen}-screen`).hidden = screen !== name;
  }
  state.screen = name;
  document.querySelector(".app-shell").dataset.screen = name;
  $("topic-search").disabled = name === "quiz";
  renderTopics();
  window.scrollTo(0, 0);
}

function makeTopicButton(name, count, index) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "topic-button";
  button.dataset.topic = name;
  button.disabled = state.screen === "quiz";
  button.setAttribute("aria-pressed", String(name === state.category));
  const icon = document.createElement("span");
  icon.className = "topic-icon";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = String(index).padStart(2, "0");
  const label = document.createElement("span");
  label.className = "topic-name";
  label.textContent = name;
  const amount = document.createElement("span");
  amount.className = "topic-amount";
  amount.textContent = count;
  button.append(icon, label, amount);
  button.addEventListener("click", () => {
    if (state.screen === "quiz") return;
    setCategory(name);
    if (state.screen === "results") showScreen("setup");
  });
  return button;
}

function renderTopics() {
  const search = $("topic-search").value.trim().toLowerCase();
  const list = $("topic-list");
  list.replaceChildren();
  const names = ["Mixed topics", ...topics()];
  names.forEach((name, index) => {
    if (!name.toLowerCase().includes(search)) return;
    const count =
      name === "Mixed topics"
        ? state.bank.length
        : state.bank.filter((question) => question.category === name).length;
    list.append(makeTopicButton(name, count, index));
  });
  if (!list.children.length && state.bank.length) {
    const empty = document.createElement("p");
    empty.className = "empty-topics";
    empty.textContent = "No matching topics. Try another search.";
    list.append(empty);
  }
}

function setCategory(name) {
  state.category = name;
  renderTopics();
  const available = pool().length;
  $("selected-topic").textContent = name;
  $("selected-description").textContent =
    name === "Mixed topics"
      ? "Questions from every subject in the bank."
      : `Practise ${name} with a new selection each round.`;
  $("available-count").textContent =
    `${available.toLocaleString()} questions available`;
  const countInput = $("question-count");
  countInput.max = String(available);
  const current = Number(countInput.value);
  countInput.value = String(Math.min(available, current > 0 ? current : 10));
  countInput.setAttribute("aria-invalid", "false");
  $("count-error").hidden = true;
  renderQuickCounts();
}

function validCount() {
  const value = $("question-count").value.trim();
  const maximum = pool().length;
  return /^[1-9]\d*$/.test(value) && Number(value) <= maximum
    ? Number(value)
    : null;
}

function renderQuickCounts() {
  const container = $("quick-count-buttons");
  container.replaceChildren();
  const maximum = pool().length;
  const choices = [
    ...new Set(
      [5, 10, 20, 50]
        .filter((n) => n <= maximum)
        .concat(maximum < 5 ? [maximum] : []),
    ),
  ];
  choices.forEach((number) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `quick-button${validCount() === number ? " active" : ""}`;
    button.textContent = String(number);
    button.setAttribute("aria-label", `${number} questions`);
    button.addEventListener("click", () => setCount(number));
    container.append(button);
  });
}

function setCount(number) {
  $("question-count").value = String(
    Math.max(1, Math.min(pool().length, number)),
  );
  $("question-count").setAttribute("aria-invalid", "false");
  $("count-error").hidden = true;
  renderQuickCounts();
}

function shuffledQuestions() {
  const questions = [...pool()];
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }
  return questions.slice(0, validCount());
}

function startQuiz() {
  const count = validCount();
  if (!count) {
    $("count-error").textContent =
      `Enter a whole number from 1 to ${pool().length.toLocaleString()}.`;
    $("count-error").hidden = false;
    $("question-count").setAttribute("aria-invalid", "true");
    $("question-count").focus();
    return;
  }
  state.questions = shuffledQuestions();
  state.index = 0;
  state.score = 0;
  state.responses = [];
  state.answered = false;
  showScreen("quiz");
  renderQuestion();
}

function renderQuestion() {
  const question = state.questions[state.index];
  const total = state.questions.length;
  state.answered = false;
  $("question-category").textContent = question.category;
  $("question-counter").textContent = `QUESTION ${state.index + 1} OF ${total}`;
  $("progress-bar").setAttribute("aria-valuemax", String(total));
  $("progress-bar").setAttribute("aria-valuenow", String(state.index));
  $("progress-fill").style.width = `${(state.index / total) * 100}%`;
  $("question-text").textContent = question.text;
  $("question-text").setAttribute("tabindex", "-1");
  $("answer-list").replaceChildren();
  question.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-button";
    const letter = document.createElement("span");
    letter.className = "answer-letter";
    letter.textContent = "ABCD"[index];
    const text = document.createElement("span");
    text.textContent = option;
    button.append(letter, text);
    button.addEventListener("click", () => submitAnswer(index));
    $("answer-list").append(button);
  });
  $("feedback").hidden = true;
  $("next-button").hidden = true;
  $("keyboard-hint").textContent = "Tip: press A-D or 1-4 to answer";
  updateProgress();
  $("question-text").focus();
}

function updateProgress() {
  $("live-score").textContent = String(state.score);
  $("compact-score").textContent = `Score: ${state.score}`;
  $("answered-count").textContent =
    `${state.responses.length} / ${state.questions.length}`;
  $("live-accuracy").textContent = state.responses.length
    ? `${Math.round((state.score / state.responses.length) * 100)}%`
    : "0%";
}

function submitAnswer(index) {
  if (state.answered || state.screen !== "quiz") return;
  state.answered = true;
  const question = state.questions[state.index];
  const correct = index === question.correct_index;
  if (correct) state.score++;
  state.responses.push(index);
  [...$("answer-list").children].forEach((button, optionIndex) => {
    button.disabled = true;
    button.classList.add(
      optionIndex === question.correct_index
        ? "correct"
        : optionIndex === index
          ? "incorrect"
          : "muted",
    );
  });
  const feedback = $("feedback");
  feedback.className = `feedback ${correct ? "good" : "bad"}`;
  feedback.textContent = correct
    ? "Correct! Nicely done."
    : `Not quite. The right answer was: ${question.options[question.correct_index]}`;
  feedback.hidden = false;
  $("progress-bar").setAttribute(
    "aria-valuenow",
    String(state.responses.length),
  );
  $("progress-fill").style.width =
    `${(state.responses.length / state.questions.length) * 100}%`;
  updateProgress();
  const next = $("next-button");
  next.innerHTML =
    state.index === state.questions.length - 1
      ? 'See my results <span aria-hidden="true">&#8594;</span>'
      : 'Next question <span aria-hidden="true">&#8594;</span>';
  next.hidden = false;
  $("keyboard-hint").textContent = "Press Enter to continue";
  next.focus();
}

function nextQuestion() {
  if (!state.answered) return;
  if (state.index + 1 === state.questions.length) {
    showResults();
  } else {
    state.index++;
    renderQuestion();
  }
}

function showResults() {
  const total = state.questions.length;
  const percentage = (state.score / total) * 100;
  const message =
    percentage >= 90
      ? "Excellent work!"
      : percentage >= 70
        ? "Good job!"
        : "Keep practicing!";
  $("result-title").textContent = message;
  $("result-subtitle").textContent =
    `You got ${state.score} out of ${total} right. Every question counts.`;
  $("result-percent").textContent = `${Number(percentage.toFixed(1))}%`;
  $("score-ring").style.setProperty("--percentage", `${percentage}%`);
  $("result-correct").textContent = String(state.score);
  $("result-total").textContent = String(total);
  $("result-topic").textContent = state.category;
  const review = $("review-list");
  review.replaceChildren();
  state.questions.forEach((question, index) => {
    if (state.responses[index] === question.correct_index) return;
    const item = document.createElement("div");
    item.className = "review-item";
    const title = document.createElement("strong");
    title.textContent = `${index + 1}. ${question.text}`;
    const chosen = document.createElement("span");
    chosen.textContent = `Your answer: ${question.options[state.responses[index]]}`;
    const right = document.createElement("span");
    right.className = "review-correct";
    right.textContent = `Correct answer: ${question.options[question.correct_index]}`;
    item.append(title, chosen, right);
    review.append(item);
  });
  $("review-panel").hidden = !review.children.length;
  showScreen("results");
  $("result-title").focus();
}

document.addEventListener("keydown", (event) => {
  if (
    state.screen !== "quiz" ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    event.repeat
  )
    return;
  if (event.target.closest("input, textarea, [contenteditable]")) return;
  if (state.answered && event.key === "Enter") {
    event.preventDefault();
    nextQuestion();
  } else if (!state.answered && /^[a-d1-4]$/i.test(event.key)) {
    event.preventDefault();
    const index = /^[1-4]$/.test(event.key)
      ? Number(event.key) - 1
      : "ABCD".indexOf(event.key.toUpperCase());
    submitAnswer(index);
  }
});

$("topic-search").addEventListener("input", renderTopics);
$("question-count").addEventListener("input", () => {
  $("count-error").hidden = true;
  $("question-count").setAttribute("aria-invalid", "false");
  renderQuickCounts();
});
$("decrease-count").addEventListener("click", () =>
  setCount((validCount() || 1) - 1),
);
$("increase-count").addEventListener("click", () =>
  setCount((validCount() || 0) + 1),
);
$("start-button").addEventListener("click", startQuiz);
$("next-button").addEventListener("click", nextQuestion);
$("exit-button").addEventListener("click", () => {
  if (
    window.confirm(
      "End this quiz and return to setup? Your progress will be lost.",
    )
  )
    showScreen("setup");
});
$("play-again-button").addEventListener("click", startQuiz);
$("change-topic-button").addEventListener("click", () => showScreen("setup"));

fetch("/api/questions")
  .then((response) => {
    if (!response.ok) throw new Error("Questions could not be loaded.");
    return response.json();
  })
  .then((questions) => {
    if (!Array.isArray(questions) || !questions.length)
      throw new Error("No questions available.");
    state.bank = questions;
    $("hero-questions").textContent = questions.length.toLocaleString();
    $("hero-topics").textContent = String(topics().length);
    $("topic-total").textContent = String(topics().length);
    setCategory("Mixed topics");
    $("start-button").disabled = false;
  })
  .catch(() => {
    $("available-count").textContent =
      "Could not load questions. Refresh the page to try again.";
  });
