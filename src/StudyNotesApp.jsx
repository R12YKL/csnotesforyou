import React, { useState, useMemo, useRef, useEffect } from "react";
import notesData from "../public/data/notes.json";
import "./styles/study-notes.css";

// --- Data transformation: notes.json (sections) -> Topic[] ---
function mapSectionsToTopics(sections) {
  return sections.map((section, idx) => ({
    id: section.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    name: section.title,
    order: idx,
    notes: (section.notes || []).map((n, i) => ({
      id: n.id || `${section.title}-${i}`,
      topicId: section.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      title: n.title,
      body: n.content,
      tags: n.tags || [],
      difficulty: n.difficulty || 1,
      status: n.status || "New",
      nextReviewDate: n.nextReviewDate || "",
      lastReviewed: n.lastReviewed || "",
      clozeRanges: n.clozeRanges || [],
    })),
  }));
}

const today = new Date().toISOString().slice(0, 10);

function highlight(text, term) {
  if (!term) return text;
  const re = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  return text.split(re).map((part, i) =>
    i % 2 === 1 ? <mark key={i}>{part}</mark> : part
  );
}

export default function StudyNotesApp() {
  const [search, setSearch] = useState("");
  const [reviewOnly, setReviewOnly] = useState(false);
  const [difficulty, setDifficulty] = useState(0); // 0 = all
  const [learned, setLearned] = useState({}); // {noteId: true}
  const [expanded, setExpanded] = useState({}); // {noteId: true}
  const [activeTopic, setActiveTopic] = useState(null);
  const topics = useMemo(() => mapSectionsToTopics(notesData.sections), []);
  const topicRefs = useRef({});

  // --- Filtered notes by search/review/difficulty ---
  const filteredTopics = useMemo(() => {
    return topics.map(topic => {
      let notes = topic.notes;
      if (search) {
        const term = search.toLowerCase();
        notes = notes.filter(n =>
          n.title.toLowerCase().includes(term) ||
          n.body.toLowerCase().includes(term) ||
          (n.tags && n.tags.some(t => t.toLowerCase().includes(term)))
        );
      }
      if (reviewOnly) {
        notes = notes.filter(n => n.nextReviewDate && n.nextReviewDate <= today);
      }
      if (difficulty > 0) {
        notes = notes.filter(n => n.difficulty === difficulty);
      }
      return { ...topic, notes };
    }).filter(t => t.notes.length > 0);
  }, [topics, search, reviewOnly, difficulty]);

  // --- Progress calculation ---
  function getProgress(topic) {
    const total = topic.notes.length;
    const learnedCount = topic.notes.filter(n => learned[n.id]).length;
    return total ? Math.round((learnedCount / total) * 100) : 0;
  }

  // --- Scroll to topic ---
  function scrollToTopic(topicId) {
    const el = topicRefs.current[topicId];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveTopic(topicId);
  }

  // --- Keyboard navigation ---
  useEffect(() => {
    function onKeyDown(e) {
      if (document.activeElement.classList.contains("note-card")) {
        const [topicIdx, noteIdx] = document.activeElement.dataset.idx.split(":").map(Number);
        if (e.key === "ArrowRight") {
          const next = document.querySelector(`[data-idx='${topicIdx}:${noteIdx + 1}']`);
          if (next) next.focus();
        } else if (e.key === "ArrowLeft") {
          const prev = document.querySelector(`[data-idx='${topicIdx}:${noteIdx - 1}']`);
          if (prev) prev.focus();
        } else if (e.key === "ArrowDown") {
          const nextTopic = document.querySelector(`[data-idx='${topicIdx + 1}:0']`);
          if (nextTopic) nextTopic.focus();
        } else if (e.key === "ArrowUp") {
          const prevTopic = document.querySelector(`[data-idx='${topicIdx - 1}:0']`);
          if (prevTopic) prevTopic.focus();
        } else if (e.key === "Enter") {
          setExpanded(exp => ({ ...exp, [document.activeElement.dataset.noteid]: true }));
        } else if (e.key === "Escape") {
          setExpanded(exp => ({ ...exp, [document.activeElement.dataset.noteid]: false }));
        }
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // --- Render ---
  return (
    <div className="study-notes-layout">
      <aside className="notes-sidebar">
        <div className="sidebar-title">Topics</div>
        <ul>
          {topics.map(t => (
            <li key={t.id} className={activeTopic === t.id ? "active" : ""}>
              <button onClick={() => scrollToTopic(t.id)}>{t.name}</button>
            </li>
          ))}
        </ul>
      </aside>
      <main className="notes-main-content">
        <div className="notes-searchbar">
          <input
            type="search"
            placeholder="Search notes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search notes"
          />
          <label>
            <input type="checkbox" checked={reviewOnly} onChange={e => setReviewOnly(e.target.checked)} />
            Review only
          </label>
          <label>
            Difficulty:
            <select value={difficulty} onChange={e => setDifficulty(Number(e.target.value))}>
              <option value={0}>All</option>
              {[1,2,3,4,5].map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </label>
        </div>
        <div className="notes-topics-list">
          {filteredTopics.length === 0 && <div className="no-results">No notes found.</div>}
          {filteredTopics.map((topic, topicIdx) => (
            <section
              key={topic.id}
              className="topic-section"
              ref={el => (topicRefs.current[topic.id] = el)}
              tabIndex={-1}
              aria-label={topic.name}
            >
              <header className="topic-header">
                <h2>{topic.name}</h2>
                <span className="topic-count">{topic.notes.length} notes</span>
                <span className="topic-progress">{getProgress(topic)}% learned</span>
              </header>
              <div className="notes-strip" style={{display:'flex',overflowX:'auto',gap:'1.2rem',scrollSnapType:'x mandatory'}}>
                {topic.notes.map((note, noteIdx) => (
                  <article
                    key={note.id}
                    className={`note-card${expanded[note.id] ? " expanded" : ""}`}
                    tabIndex={0}
                    data-idx={`${topicIdx}:${noteIdx}`}
                    data-noteid={note.id}
                    aria-label={note.title}
                    style={{scrollSnapAlign:'start'}}
                  >
                    <div className="note-header">
                      <div className="note-title">{highlight(note.title, search)}</div>
                      <div className="note-meta">
                        <span className="note-status">{note.status}</span>
                        <span className="note-diff">{"★".repeat(note.difficulty)}</span>
                        <span>{note.tags && note.tags.map(t=>`#${t}`).join(" ")}</span>
                        <span>Last: {note.lastReviewed}</span>
                      </div>
                    </div>
                    <div className="note-body-preview">
                      {expanded[note.id]
                        ? <span>{highlight(note.body, search)}</span>
                        : <span>{highlight(note.body.slice(0, 200), search)}{note.body.length > 200 ? "..." : ""}</span>
                      }
                    </div>
                    <button
                      className="note-learned-btn"
                      aria-pressed={!!learned[note.id]}
                      onClick={() => setLearned(l => ({ ...l, [note.id]: !l[note.id] }))}
                    >
                      {learned[note.id] ? "Learned" : "Mark as Learned"}
                    </button>
                    <button
                      className="note-expand-btn"
                      onClick={() => setExpanded(e => ({ ...e, [note.id]: !e[note.id] }))}
                      aria-expanded={!!expanded[note.id]}
                    >
                      {expanded[note.id] ? "Collapse" : "Expand"}
                    </button>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
