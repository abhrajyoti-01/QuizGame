import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchQuestions } from "../lib/api.js";

/**
 * Owns the whole quiz state machine: question bank, topic selection,
 * round setup, answering, and results. Components stay presentational.
 */
export function useQuiz() {
  const [bank, setBank] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("Mixed topics");
  const [query, setQuery] = useState("");
  const [count, setCount] = useState(10);
  const [countError, setCountError] = useState("");
  const [screen, setScreen] = useState("setup");
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [responses, setResponses] = useState([]);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    let active = true;
    fetchQuestions()
      .then((data) => active && setBank(data))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const topics = useMemo(() => [...new Set(bank.map((q) => q.category))], [bank]);

  const topicCounts = useMemo(() => {
    const counts = new Map([["Mixed topics", bank.length]]);
    for (const topic of topics) {
      counts.set(topic, bank.filter((q) => q.category === topic).length);
    }
    return counts;
  }, [bank, topics]);

  const visibleTopics = useMemo(() => {
    const search = query.trim().toLowerCase();
    const names = ["Mixed topics", ...topics];
    return search ? names.filter((name) => name.toLowerCase().includes(search)) : names;
  }, [topics, query]);

  const pool = useMemo(
    () => (category === "Mixed topics" ? bank : bank.filter((q) => q.category === category)),
    [bank, category],
  );

  // Keep the chosen length inside the selected topic's pool.
  useEffect(() => {
    const max = pool.length;
    if (!max) return;
    setCount((current) => {
      const value = Number(current);
      if (!Number.isInteger(value) || value < 1) return Math.min(10, max);
      return Math.min(value, max);
    });
  }, [pool.length]);

  const chooseTopic = useCallback((name) => {
    setCategory(name);
    setCountError("");
    setScreen((current) => (current === "results" ? "setup" : current));
  }, []);

  const setQuestionCount = useCallback((value) => {
    setCount(value);
    setCountError("");
  }, []);

  const startQuiz = useCallback(() => {
    const max = pool.length;
    const value = Number(count);
    if (!Number.isInteger(value) || value < 1 || value > max) {
      setCountError(`Enter a whole number from 1 to ${max.toLocaleString()}.`);
      return;
    }
    const draw = [...pool];
    for (let i = draw.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [draw[i], draw[j]] = [draw[j], draw[i]];
    }
    setQuestions(draw.slice(0, value));
    setIndex(0);
    setScore(0);
    setResponses([]);
    setAnswered(false);
    setScreen("quiz");
  }, [pool, count]);

  const submitAnswer = useCallback(
    (choice) => {
      if (answered || screen !== "quiz") return;
      setAnswered(true);
      if (choice === questions[index].correct_index) setScore((s) => s + 1);
      setResponses((r) => [...r, choice]);
    },
    [answered, screen, questions, index],
  );

  const nextQuestion = useCallback(() => {
    if (!answered) return;
    if (index + 1 === questions.length) {
      setScreen("results");
    } else {
      setIndex((i) => i + 1);
      setAnswered(false);
    }
  }, [answered, index, questions.length]);

  const endQuiz = useCallback(() => {
    if (!window.confirm("End this quiz and return to setup? Your progress will be lost.")) return;
    setQuestions([]);
    setResponses([]);
    setIndex(0);
    setScore(0);
    setAnswered(false);
    setScreen("setup");
  }, []);

  const playAgain = useCallback(() => startQuiz(), [startQuiz]);
  const backToSetup = useCallback(() => setScreen("setup"), []);

  return {
    bank,
    loading,
    error,
    category,
    chooseTopic,
    query,
    setQuery,
    topics,
    topicCounts,
    visibleTopics,
    pool,
    count,
    setQuestionCount,
    countError,
    screen,
    questions,
    index,
    score,
    responses,
    answered,
    startQuiz,
    submitAnswer,
    nextQuestion,
    endQuiz,
    playAgain,
    backToSetup,
  };
}
