# 🎯 Quiz Game

A browser-based multiple-choice quiz with **1,009 questions** across **20 topics** — from DSA and automata to AI agents and general knowledge. The original terminal game is still available.

Pure Python 3.8+. No third-party packages. No build step.

```powershell
python web_app.py
```

Open **http://127.0.0.1:8000/** in your browser. Use `python web_app.py --port 8080` if port 8000 is busy. Press `Ctrl+C` to stop the server.

For the terminal version, run `python quiz_game.py`.

---

## ✨ Highlights

- **1,009 questions** — every topic ships at least 50 MCQs
- **20 topics** — academics, programming, and AI covered in depth
- **Instant feedback** — correct/incorrect after every answer
- **Randomized draws** — no repeats within a game, different every round
- **Mixed mode** — quiz across all topics at once
- **Responsive web interface** — desktop and mobile, keyboard shortcuts, and answer review
- **Zero dependencies** — standard library only

---

## 🕹️ How to Play

1. Run the web server and open the local address above.
2. Pick a topic from the sidebar or keep **Mixed topics** selected.
3. Choose how many questions you want (1 up to that topic's total) and start.
4. Click an answer or press `A`–`D` / `1`–`4`. Get instant feedback, then continue.
5. See your score, percentage, performance message, and missed-answer review. Play again for a fresh draw.

**Scoring bands**

| Percentage | Message |
| --- | --- |
| 90 – 100% | Excellent work! |
| 70 – 89% | Good job! |
| 0 – 69% | Keep practicing! |

---

## 📚 Topics

| # | Topic | Questions |
| --- | --- | --- |
| 1 | India | 50 |
| 2 | West Bengal | 50 |
| 3 | Aptitude | 50 |
| 4 | Mathematics | 50 |
| 5 | Graph Theory | 50 |
| 6 | Logical Equations | 50 |
| 7 | Set Relations | 50 |
| 8 | Permutations and Combinations | 50 |
| 9 | Automata | 50 |
| 10 | Digital Logic | 50 |
| 11 | Python | 50 |
| 12 | Web Design | 50 |
| 13 | DSA | 50 |
| 14 | Java | 50 |
| 15 | PHP | 50 |
| 16 | C Programming | 50 |
| 17 | JavaScript | 50 |
| 18 | AI Applications | 59 |
| 19 | AI Agents | 50 |
| 20 | General Knowledge | 50 |

Menu numbers are generated from the data, so they stay accurate as topics grow.

### Topic Notes

- **Graph Theory** — MST, connectivity, bipartite graphs, flow, matching, complexity.
- **Logical Equations** — truth tables, De Morgan, implication rules, quantifiers, fallacies.
- **Set Relations** — operations, cardinality, equivalence classes, functions, pigeonhole.
- **Permutations and Combinations** — factorials, nCr/nPr, derangements, counting problems.
- **Automata** — DFA/NFA/PDA/Turing, pumping lemma, grammar hierarchy, state minimization.
- **Digital Logic** — gates, number systems, adders, flip-flops, K-map, Boolean simplification.
- **DSA** — stacks, queues, trees, hashing, heaps, sorting, graph algorithms, DP.
- **AI Applications** — NLP, computer vision, speech, recommenders, forecasting, healthcare AI.
- **AI Agents** — agent types, PEAS, perception/action, planning, ReAct, tool use, memory, guardrails, frameworks, multi-agent collaboration.

---

## 🛠️ Adding Questions

Append a tuple to any topic in [question_bank.py](question_bank.py):

```python
("What is the question?", ("Option A", "Option B", "Option C", "Option D"), 2),
```

Rules the loader enforces:

- Exactly **4 options**, all distinct and non-empty
- `correct_index` is **zero-based** — `0` for A/1 through `3` for D/4
- Question text is unique across the whole bank

[quiz_game.py](quiz_game.py) rebuilds the menu, question counts, and percentages automatically. Add a whole new topic by creating a new list in the same dict.

---

## 🗂️ Project Layout

```
LibraryManagement/
├── web_app.py         # local web server and questions API
├── index.html         # browser interface
├── styles.css         # responsive layout
├── app.js             # quiz interaction and scoring
├── quiz_game.py       # original terminal game and question loader
├── question_bank.py   # shared quiz data by topic
├── README.md
└── LICENSE
```

---

## 📄 License

Released under the [MIT License](LICENSE) — free to use, modify, and distribute.
