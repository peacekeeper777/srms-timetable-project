import { useState } from "react";
import axios from "axios";
import { Bot, Lightbulb, MessageCircle, Send, TriangleAlert } from "lucide-react";
import { API_URL } from "../utils/api";

export default function AIPanel({ timetable }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  if (!timetable) return null;

  const askAI = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer("");
    try {
      const res = await axios.post(`${API_URL}/api/ai/chat`, {
        timetableId: timetable._id,
        question,
      });
      setAnswer(res.data.answer);
    } catch {
      setAnswer("AI chat could not be reached. Check the backend server and API key.");
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    "Is this timetable balanced?",
    "Which day looks busiest?",
    "How can I reduce conflicts?",
  ];

  return (
    <div className="ai-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">AI review</p>
          <h2><Bot size={22} /> Simple timetable explanation</h2>
        </div>
      </div>

      <div className="ai-insight-grid">
        <article className="ai-card">
          <h3><MessageCircle size={18} /> What AI understood</h3>
          <p>{timetable.aiExplanation || "AI analysis is not available yet."}</p>
        </article>

        <article className="ai-card">
          <h3><Lightbulb size={18} /> Suggestions</h3>
          {timetable.aiSuggestions?.length > 0 ? (
            <ul>
              {timetable.aiSuggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          ) : (
            <p>No suggestions returned.</p>
          )}
        </article>

        <article className="ai-card">
          <h3><TriangleAlert size={18} /> Things to check</h3>
          {timetable.conflicts?.length > 0 ? (
            <ul>
              {timetable.conflicts.map((conflict, index) => (
                <li key={index}>{conflict}</li>
              ))}
            </ul>
          ) : (
            <p>No conflicts found.</p>
          )}
        </article>
      </div>

      <article className="ai-chat card">
        <h3>Ask about this timetable</h3>
        <div className="quick-prompts">
          {quickQuestions.map((prompt) => (
            <button key={prompt} className="button button-secondary" type="button" onClick={() => setQuestion(prompt)}>
              {prompt}
            </button>
          ))}
        </div>
        <div className="chat-row">
          <input
            className="input"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask in normal words, e.g. Can labs be moved to afternoon?"
            onKeyDown={(e) => e.key === "Enter" && askAI()}
          />
          <button className="button" onClick={askAI} disabled={loading}>
            <Send size={18} />
            {loading ? "Asking..." : "Ask"}
          </button>
        </div>
        {answer && <p className="ai-answer">{answer}</p>}
      </article>
    </div>
  );
}
