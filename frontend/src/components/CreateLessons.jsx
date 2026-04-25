import { useState } from 'react';
import api from '../api';

const TABS = ['Lesson Info', 'AI Conversation Role'];

export default function CreateLessons() {
  const [activeTab, setActiveTab] = useState(0);
  const [lessonId, setLessonId] = useState(null);

  // ── Lesson Info form ──
  const [form, setForm] = useState({
    course_name: '',
    course_code: '',
    description: '',
    status: 'active',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // ── AI Role form ──
  const [aiForm, setAiForm] = useState({
    persona_name: '',
    persona_description: '',
    student_persona: '',
    topic_description: '',
    vocabulary_hints: '',
    off_topic_phrase: '',
    strict_mode: false,
  });
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuccess, setAiSuccess] = useState('');
  const [aiError, setAiError] = useState('');

  function set(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  function setAi(field) {
    return (e) => setAiForm({ ...aiForm, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!form.course_name.trim()) { setError('Course name is required.'); return; }
    setLoading(true);
    try {
      const res = await api.post('/courses', form);
      setLessonId(res.data?.course_id || res.data?.id || 1);
      setSuccess('Lesson created! You can now configure the AI Role.');
      setForm({ course_name: '', course_code: '', description: '', status: 'active' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create lesson.');
    } finally {
      setLoading(false);
    }
  }

  async function handleAiSave() {
    setAiError(''); setAiSuccess('');
    if (!aiForm.persona_name.trim()) { setAiError('AI Persona Name is required.'); return; }
    if (!lessonId) { setAiError('Please create a lesson first in the Lesson Info tab.'); return; }
    setAiLoading(true);
    try {
      await api.post(`/instructor/lessons/${lessonId}/ai-role`, aiForm);
      setAiSuccess('AI Role saved successfully!');
    } catch (err) {
      setAiError(err.response?.data?.error || 'Failed to save AI Role.');
    } finally {
      setAiLoading(false);
    }
  }

  // ── Generated system prompt preview ──
  function generatePrompt() {
    const { persona_name, persona_description, student_persona, topic_description, vocabulary_hints, off_topic_phrase, strict_mode } = aiForm;
    if (!persona_name) return 'Fill in the fields above to preview the generated system prompt...';
    return `You are ${persona_name || '[AI Name]'}.${persona_description ? ' ' + persona_description : ''}

The student will play the role of: ${student_persona || '[Student Persona]'}

Topic: ${topic_description || '[Topic Description]'}
${vocabulary_hints ? `\nEncourage use of these words: ${vocabulary_hints}` : ''}
${off_topic_phrase ? `\nIf the student goes off-topic, say: "${off_topic_phrase}"` : ''}
${strict_mode ? '\nStrict Mode ON: Escalate after 3 consecutive off-topic turns.' : ''}`;
  }

  return (
    <div className="content-container">
      <h2>Create Lesson</h2>

      {/* Tabs */}
      <div style={s.tabs}>
        {TABS.map((tab, i) => (
          <button
            key={i}
            style={{ ...s.tab, ...(activeTab === i ? s.tabActive : {}) }}
            onClick={() => setActiveTab(i)}
          >
            {i === 1 && '🤖 '}{tab}
          </button>
        ))}
      </div>

      {/* ── Tab 0: Lesson Info ── */}
      {activeTab === 0 && (
        <div>
          <p style={{ marginBottom: 16, color: '#555' }}>Fill in the details to create a new lesson/course for your students.</p>

          {success && <p style={s.successMsg}>✓ {success}</p>}
          {error   && <p style={s.errorMsg}>✗ {error}</p>}

          <form onSubmit={handleSubmit}>
            <label style={s.label}>Lesson / Course Name *</label>
            <input style={s.input} type="text" placeholder="e.g. Introduction to Software Engineering"
              value={form.course_name} onChange={set('course_name')} disabled={loading} required />

            <label style={s.label}>Course Code</label>
            <input style={s.input} type="text" placeholder="e.g. CS101"
              value={form.course_code} onChange={set('course_code')} disabled={loading} />

            <label style={s.label}>Description</label>
            <textarea style={s.textarea} placeholder="Brief description of this lesson..."
              value={form.description} onChange={set('description')} disabled={loading} />

            <label style={s.label}>Status</label>
            <select style={s.input} value={form.status} onChange={set('status')} disabled={loading}>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>

            <button type="submit" style={s.btn} disabled={loading}>
              {loading ? 'Creating...' : 'Create Lesson'}
            </button>
          </form>
        </div>
      )}

      {/* ── Tab 1: AI Conversation Role ── */}
      {activeTab === 1 && (
        <div>
          <p style={{ marginBottom: 16, color: '#555' }}>
            Configure the AI persona and conversation context for this lesson's chat feature.
          </p>

          {aiSuccess && <p style={s.successMsg}>✓ {aiSuccess}</p>}
          {aiError   && <p style={s.errorMsg}>✗ {aiError}</p>}

          <div style={s.aiGrid}>
            {/* Left: Form fields */}
            <div style={s.aiLeft}>
              <label style={s.label}>AI Persona Name *</label>
              <input style={s.input} type="text" placeholder="e.g. Marco the Waiter"
                value={aiForm.persona_name} onChange={setAi('persona_name')} />

              <label style={s.label}>AI Persona Description</label>
              <textarea style={s.textarea} placeholder="Describe the AI's backstory and personality..."
                value={aiForm.persona_description} onChange={setAi('persona_description')} />

              <label style={s.label}>Student Persona Name</label>
              <input style={s.input} type="text" placeholder="e.g. A customer at an Italian restaurant"
                value={aiForm.student_persona} onChange={setAi('student_persona')} />

              <label style={s.label}>Topic Description</label>
              <textarea style={s.textarea} placeholder="Define what the conversation should be about..."
                value={aiForm.topic_description} onChange={setAi('topic_description')} />

              <label style={s.label}>Vocabulary Hints</label>
              <input style={s.input} type="text" placeholder="e.g. buongiorno, prego, grazie (comma-separated)"
                value={aiForm.vocabulary_hints} onChange={setAi('vocabulary_hints')} />

              <label style={s.label}>Off-Topic Reminder Phrase</label>
              <input style={s.input} type="text" placeholder="e.g. Let's keep our conversation on topic!"
                value={aiForm.off_topic_phrase} onChange={setAi('off_topic_phrase')} />

              {/* Strict Mode Toggle */}
              <div style={s.toggleRow}>
                <div>
                  <div style={s.toggleLabel}>Strict Mode</div>
                  <div style={s.toggleSub}>AI escalates after 3 consecutive off-topic turns</div>
                </div>
                <div
                  style={{ ...s.toggle, background: aiForm.strict_mode ? '#2e7d32' : '#ccc' }}
                  onClick={() => setAiForm({ ...aiForm, strict_mode: !aiForm.strict_mode })}
                >
                  <div style={{ ...s.toggleKnob, transform: aiForm.strict_mode ? 'translateX(22px)' : 'translateX(2px)' }} />
                </div>
              </div>

              <button style={s.btn} onClick={handleAiSave} disabled={aiLoading}>
                {aiLoading ? 'Saving...' : '💾 Save AI Role'}
              </button>
            </div>

            {/* Right: Preview */}
            <div style={s.aiRight}>
              <div style={s.previewHeader}>📋 Generated System Prompt Preview</div>
              <textarea
                style={s.previewBox}
                value={generatePrompt()}
                readOnly
              />
              <p style={s.previewNote}>This is a read-only preview of the system prompt that will be sent to the AI.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  tabs: { display: 'flex', gap: 8, marginBottom: 20, borderBottom: '2px solid #e0e0e0', paddingBottom: 0 },
  tab: {
    padding: '10px 20px', border: 'none', background: 'transparent',
    fontWeight: 700, fontSize: 14, cursor: 'pointer', color: '#666',
    borderBottom: '3px solid transparent', marginBottom: -2, borderRadius: '6px 6px 0 0',
    transition: 'all 0.15s'
  },
  tabActive: { color: '#2e7d32', borderBottom: '3px solid #2e7d32', background: '#f1f8f1' },
  label: { display: 'block', marginBottom: 4, fontWeight: 600, fontSize: 13, color: '#333' },
  input: { width: '100%', padding: '10px', borderRadius: 6, border: '1px solid #ccc', marginBottom: 12, boxSizing: 'border-box', fontSize: 14 },
  textarea: { width: '100%', padding: '10px', borderRadius: 6, border: '1px solid #ccc', marginBottom: 12, boxSizing: 'border-box', minHeight: 80, resize: 'vertical', fontSize: 14 },
  btn: { background: '#2e7d32', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 6, fontWeight: 700, fontSize: 14, cursor: 'pointer', marginTop: 8 },
  successMsg: { color: '#2e7d32', fontWeight: 700, marginBottom: 12, padding: '8px 12px', background: '#e8f5e9', borderRadius: 6 },
  errorMsg: { color: '#e03a3a', fontWeight: 700, marginBottom: 12, padding: '8px 12px', background: '#fde8e8', borderRadius: 6 },
  aiGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 },
  aiLeft: { display: 'flex', flexDirection: 'column' },
  aiRight: { display: 'flex', flexDirection: 'column', gap: 8 },
  previewHeader: { fontWeight: 800, fontSize: 13, color: '#2e7d32', marginBottom: 6 },
  previewBox: {
    flex: 1, minHeight: 320, padding: 14, borderRadius: 8,
    border: '1px solid #c8e6c9', background: '#f1f8f1',
    fontSize: 13, lineHeight: 1.6, color: '#333',
    resize: 'none', fontFamily: 'monospace'
  },
  previewNote: { fontSize: 11, color: '#888', fontStyle: 'italic' },
  toggleRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, padding: '12px', background: '#f5f5f5', borderRadius: 8 },
  toggleLabel: { fontWeight: 700, fontSize: 14, color: '#333' },
  toggleSub: { fontSize: 12, color: '#666', marginTop: 2 },
  toggle: { width: 46, height: 24, borderRadius: 12, cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 },
  toggleKnob: { width: 20, height: 20, background: '#fff', borderRadius: '50%', position: 'absolute', top: 2, transition: 'transform 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' },
};