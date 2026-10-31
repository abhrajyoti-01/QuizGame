import { Sidebar } from "./components/Sidebar.jsx";
import { Topbar } from "./components/Topbar.jsx";
import { SetupScreen } from "./components/screens/SetupScreen.jsx";
import { QuizScreen } from "./components/screens/QuizScreen.jsx";
import { ResultsScreen } from "./components/screens/ResultsScreen.jsx";
import { useQuiz } from "./hooks/useQuiz.js";

export function App() {
  const quiz = useQuiz();

  return (
    <div className="app-shell" data-screen={quiz.screen}>
      <Sidebar
        screen={quiz.screen}
        category={quiz.category}
        onChooseTopic={quiz.chooseTopic}
        query={quiz.query}
        onQueryChange={quiz.setQuery}
        visibleTopics={quiz.visibleTopics}
        topicCounts={quiz.topicCounts}
        hasBank={quiz.bank.length > 0}
        topicTotal={quiz.topics.length}
      />
      <main className="main-content">
        <Topbar />
        <div className="content-wrap">
          {quiz.screen === "setup" && <SetupScreen quiz={quiz} />}
          {quiz.screen === "quiz" && <QuizScreen quiz={quiz} />}
          {quiz.screen === "results" && <ResultsScreen quiz={quiz} />}
        </div>
      </main>
    </div>
  );
}
