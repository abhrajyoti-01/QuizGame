import { SearchIcon } from "./ui/Icons.jsx";

export function Sidebar({
  screen,
  category,
  onChooseTopic,
  query,
  onQueryChange,
  visibleTopics,
  topicCounts,
  hasBank,
  topicTotal,
}) {
  const locked = screen === "quiz";

  return (
    <aside className="sidebar" aria-label="Quiz topics">
      <a className="brand" href="/" aria-label="Quizcraft home">
        <span className="brand-mark" aria-hidden="true">
          Q<span>.</span>
        </span>
        <span>
          quizcraft<span className="brand-dot">.</span>
        </span>
      </a>

      <div className="sidebar-intro">
        <span className="eyebrow">Question library</span>
        <h2>
          Choose your
          <br />
          subject.
        </h2>
        <p>Explore a topic, or select Mixed topics for a little of everything.</p>
      </div>

      <div className="sidebar-label-row">
        <span className="sidebar-label">Explore topics</span>
        <span className="sidebar-count">{hasBank ? topicTotal : "--"}</span>
      </div>

      <label className="search-wrap">
        <SearchIcon className="search-icon" />
        <span className="sr-only">Search topics</span>
        <input
          type="search"
          placeholder="Find a topic..."
          autoComplete="off"
          value={query}
          disabled={locked}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </label>

      <nav className="topic-list" aria-label="Choose a topic">
        {visibleTopics.map((name, index) => (
          <button
            key={name}
            type="button"
            className={`topic-button${name === category ? " active" : ""}`}
            disabled={locked}
            aria-pressed={name === category}
            onClick={() => onChooseTopic(name)}
          >
            <span className="topic-icon" aria-hidden="true">
              {String(index).padStart(2, "0")}
            </span>
            <span className="topic-name">{name}</span>
            <span className="topic-amount">{topicCounts.get(name)}</span>
          </button>
        ))}
        {!visibleTopics.length && hasBank && (
          <p className="empty-topics">No matching topics. Try another search.</p>
        )}
      </nav>
    </aside>
  );
}
