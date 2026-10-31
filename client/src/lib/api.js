export async function fetchQuestions() {
  const response = await fetch("/api/questions");
  if (!response.ok) throw new Error("Questions could not be loaded.");
  const data = await response.json();
  if (!Array.isArray(data) || !data.length) throw new Error("No questions available.");
  return data;
}
