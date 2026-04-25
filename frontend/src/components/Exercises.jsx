import { useState, useRef, useEffect } from 'react';

const exercises = [
  { id: 1, title: 'Grammar Quiz', subject: 'ENG101 - English Grammar', deadline: 'March 5, 2026', color: '#E8832A' },
  { id: 2, title: 'Essay Writing Task', subject: 'ENG201 - Writing Skills', deadline: 'March 10, 2026', color: '#7B5EA7' },
  { id: 3, title: 'Reading Comprehension', subject: 'ENG102 - Reading Skills', deadline: 'March 7, 2026', color: '#D95F3B' },
  { id: 4, title: 'Vocabulary Practice', subject: 'ENG103 - Vocabulary Building', deadline: 'March 15, 2026', color: '#4A5568' },
];

const STEPS = ['Objectives', 'Lesson Slides', 'Congratulations', 'AI Tutor'];

const AI_QUESTIONS = [
  { q: 'What does SE stand for in Software Engineering?', a: 'Software Engineering' },
  { q: 'What is the primary goal of Software Engineering?', a: 'Build reliable software' },
  { q: 'Which methodology uses sprints?', a: 'Agile' },
  { q: 'What does UML stand for?', a: 'Unified Modeling Language' },
  { q: 'What is a use case diagram used for?', a: 'Modeling system behavior' },
];

const QUICK_TIPS = ['Explain SDLC phases', 'Real-world cases', 'Dev team roles', 'Study tips', 'Eng vs Programming', 'Ethics in software'];

function AITutorChat({ exercise, onDone }) {
  const [phase, setPhase] = useState('intro'); // intro | quiz | done
  const [messages, setMessages] = useState([
    { from: 'ai', text: "Hi! 👋\nI'm your AI Study Assistant.\nLet's start your exercise.\nAre you ready?" }
  ]);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [input, setInput] = useState('');
  const [xpEarned, setXpEarned] = useState(0);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function sendMessage(text) {
    const userMsg = { from: 'user', text };
    const newMessages = [...messages, userMsg];

    if (phase === 'intro') {
      setPhase('quiz');
      setMessages([
        ...newMessages,
        { from: 'ai', text: `Great! 😊\nYou will get ${AI_QUESTIONS.length} questions.\nLet's begin! 🚀` },
        { from: 'ai', text: `Q${questionIdx + 1}: ${AI_QUESTIONS[questionIdx].q}` }
      ]);
    } else if (phase === 'quiz') {
      const current = AI_QUESTIONS[questionIdx];
      const isCorrect = text.toLowerCase().includes(current.a.toLowerCase());
      const feedback = isCorrect
        ? { from: 'ai', text: `Correct! Well done 🎉\n${current.a}` }
        : { from: 'ai', text: `Oops! That's incorrect.\nThe correct answer is: ${current.a}` };

      if (isCorrect) setXpEarned(xp => xp + 10);

      const next = questionIdx + 1;
      if (next < AI_QUESTIONS.length) {
        setQuestionIdx(next);
        setMessages([...newMessages, feedback, { from: 'ai', text: `Q${next + 1}: ${AI_QUESTIONS[next].q}` }]);
      } else {
        setPhase('done');
        setMessages([...newMessages, feedback, { from: 'ai', text: `🎓 Exercise complete! You earned ${isCorrect ? xpEarned + 10 : xpEarned} XP. Great work!` }]);
      }
    }
    setInput('');
  }

  function handleSend() {
    if (input.trim()) sendMessage(input.trim());
  }

  return (
    <div style={styles.chatWrapper}>
      {/* Header */}
      <div style={styles.chatHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={styles.aiAvatar}>🤖</div>
          <div>
            <div style={styles.chatTitle}>Ask the AI Tutor</div>
            <div style={styles.chatSubtitle}>Lesson 6 — {exercise.title}</div>
          </div>
        </div>
        <div style={styles.tipsBtn}>💡 Tips</div>
      </div>

      {/* Messages */}
      <div style={styles.chatMessages}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start', marginBottom: 12 }}>
            {msg.from === 'ai' && <div style={styles.aiDot}>🤖</div>}
            <div style={msg.from === 'ai' ? styles.aiBubble : styles.userBubble}>
              {msg.text.split('\n').map((line, j) => <div key={j}>{line}</div>)}
            </div>
            {msg.from === 'user' && <div style={styles.userDot}>👤</div>}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Quick tips */}
      <div style={styles.quickTips}>
        {QUICK_TIPS.map((tip, i) => (
          <button key={i} style={styles.tipChip} onClick={() => sendMessage(tip)}>📌 {tip}</button>
        ))}
      </div>

      {/* Input */}
      <div style={styles.chatInputRow}>
        <input
          style={styles.chatInput}
          placeholder="Ask anything about this lesson..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          disabled={phase === 'done'}
        />
        <button style={styles.sendBtn} onClick={handleSend} disabled={phase === 'done'}>▶</button>
      </div>

      {/* XP Badge */}
      {xpEarned > 0 && (
        <div style={styles.xpBadge}>+{xpEarned} XP EARNED</div>
      )}
    </div>
  );
}

export default function Exercises() {
  const [activeExercise, setActiveExercise] = useState(null);
  const [step, setStep] = useState(3); // 3 = AI Tutor step active

  if (activeExercise) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Page header */}
        <div className="page-header">
          <div className="page-header-icon" style={{ fontSize: 20 }}>🧠</div>
          <h1>EXERCISES</h1>
        </div>

        {/* Step progress */}
        <div style={styles.stepper}>
          {STEPS.map((s, i) => (
            <div key={i} style={styles.stepItem}>
              <div style={{ ...styles.stepDot, background: i <= step ? '#4ade80' : '#ffffff44' }}>
                {i < step ? '✓' : i + 1}
              </div>
              <span style={{ ...styles.stepLabel, color: i <= step ? '#fff' : '#ffffff88' }}>{s}</span>
              {i < STEPS.length - 1 && <div style={styles.stepLine} />}
            </div>
          ))}
          <div style={styles.xpPill}>+50 XP EARNED</div>
        </div>

        <AITutorChat exercise={activeExercise} onDone={() => setActiveExercise(null)} />

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button style={styles.doneBtn} onClick={() => setActiveExercise(null)}>DONE</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="page-header">
        <div className="page-header-icon" style={{ fontSize: 20 }}>🧠</div>
        <h1>EXERCISES</h1>
      </div>

      {/* Step progress bar */}
      <div style={styles.stepper}>
        {STEPS.map((s, i) => (
          <div key={i} style={styles.stepItem}>
            <div style={{ ...styles.stepDot, background: i === 0 ? '#4ade80' : '#ffffff44' }}>
              {i === 0 ? '✓' : i + 1}
            </div>
            <span style={{ ...styles.stepLabel, color: i === 0 ? '#fff' : '#ffffff88' }}>{s}</span>
            {i < STEPS.length - 1 && <div style={styles.stepLine} />}
          </div>
        ))}
      </div>

      <div style={styles.grid}>
        {exercises.map((ex) => (
          <div key={ex.id} style={{ ...styles.card, background: ex.color }}>
            <div>
              <div style={styles.cardLabel}>EXERCISE TITLE:</div>
              <div style={styles.cardValue}>{ex.title}</div>
              <div style={styles.cardLabel}>SUBJECT:</div>
              <div style={styles.cardValue}>{ex.subject}</div>
              <div style={styles.cardLabel}>DEADLINES: <span style={styles.cardValue}>{ex.deadline}</span></div>
            </div>
            <button style={styles.viewBtn} onClick={() => setActiveExercise(ex)}>View</button>
          </div>
        ))}
      </div>
    </>
  );
}

const styles = {
  stepper: {
    display: 'flex', alignItems: 'center', gap: 6,
    background: 'rgba(0,0,0,0.15)', borderRadius: 30,
    padding: '8px 16px', marginBottom: 12, flexWrap: 'wrap'
  },
  stepItem: { display: 'flex', alignItems: 'center', gap: 6 },
  stepDot: {
    width: 22, height: 22, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 11, fontWeight: 700, color: '#fff'
  },
  stepLabel: { fontSize: 12, fontWeight: 600 },
  stepLine: { width: 30, height: 2, background: '#ffffff44', margin: '0 4px' },
  xpPill: {
    marginLeft: 'auto', background: '#4ade80', color: '#1a5c2a',
    borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 800
  },
  grid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16
  },
  card: {
    borderRadius: 14, padding: '20px 20px 14px',
    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    minHeight: 160, gap: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.18)'
  },
  cardLabel: { fontSize: 11, color: 'rgba(255,255,255,0.75)', fontWeight: 700, textTransform: 'uppercase', marginTop: 4 },
  cardValue: { fontSize: 14, color: '#fff', fontWeight: 700 },
  viewBtn: {
    alignSelf: 'flex-end', background: '#4ade80', color: '#1a5c2a',
    border: 'none', borderRadius: 20, padding: '6px 22px',
    fontWeight: 800, fontSize: 13, cursor: 'pointer'
  },
  chatWrapper: {
    background: '#1a4a2e', borderRadius: 16, overflow: 'hidden',
    display: 'flex', flexDirection: 'column', minHeight: 380
  },
  chatHeader: {
    background: '#163d26', padding: '12px 16px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
  },
  aiAvatar: { fontSize: 22 },
  chatTitle: { color: '#fff', fontWeight: 700, fontSize: 14 },
  chatSubtitle: { color: '#ffffff88', fontSize: 11 },
  tipsBtn: {
    background: '#4ade80', color: '#1a5c2a',
    borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer'
  },
  chatMessages: {
    flex: 1, overflowY: 'auto', padding: '16px',
    display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 280
  },
  aiDot: { fontSize: 18, marginRight: 8, alignSelf: 'flex-end' },
  userDot: { fontSize: 18, marginLeft: 8, alignSelf: 'flex-end' },
  aiBubble: {
    background: '#2d6a45', color: '#fff', borderRadius: '12px 12px 12px 0',
    padding: '10px 14px', fontSize: 13, maxWidth: '65%', lineHeight: 1.5
  },
  userBubble: {
    background: '#4ade80', color: '#1a3d20', borderRadius: '12px 12px 0 12px',
    padding: '10px 14px', fontSize: 13, maxWidth: '65%', fontWeight: 600, lineHeight: 1.5
  },
  quickTips: {
    display: 'flex', gap: 6, padding: '8px 16px', flexWrap: 'wrap',
    borderTop: '1px solid #ffffff15'
  },
  tipChip: {
    background: '#2d6a45', color: '#fff', border: 'none',
    borderRadius: 20, padding: '4px 10px', fontSize: 11, cursor: 'pointer'
  },
  chatInputRow: {
    display: 'flex', gap: 8, padding: '10px 16px',
    borderTop: '1px solid #ffffff15', alignItems: 'center'
  },
  chatInput: {
    flex: 1, background: '#2d6a45', border: 'none', borderRadius: 20,
    padding: '10px 16px', color: '#fff', fontSize: 13, outline: 'none'
  },
  sendBtn: {
    background: '#4ade80', border: 'none', borderRadius: '50%',
    width: 36, height: 36, color: '#1a5c2a', fontWeight: 800,
    fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  xpBadge: {
    alignSelf: 'center', background: '#4ade80', color: '#1a5c2a',
    borderRadius: 20, padding: '4px 14px', fontSize: 12, fontWeight: 800, margin: '8px 0'
  },
  doneBtn: {
    background: '#4ade80', color: '#1a5c2a', border: 'none',
    borderRadius: 8, padding: '10px 32px', fontWeight: 800, fontSize: 14, cursor: 'pointer'
  },
};
