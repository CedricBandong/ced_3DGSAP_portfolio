import { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import aiContext from "../constants/ai-context.json";

// ─── Build system prompt from ai-context.json ────────────────────────────────

const buildSystemPrompt = () => {
  const ctx = aiContext;
  const lines = [];

  lines.push(
    `You are a helpful AI assistant embedded in ${ctx.name || "a developer"}'s portfolio website.`,
    `Answer questions about ${ctx.name || "the portfolio owner"} in a friendly, concise tone.`,
    `If you don't know something, say so honestly rather than making it up.`,
    ``
  );

  if (ctx.about) lines.push(`About: ${ctx.about}`, ``);
  if (ctx.tagline) lines.push(`Tagline: ${ctx.tagline}`, ``);
  if (ctx.location) lines.push(`Location: ${ctx.location}`, ``);
  if (ctx.availability) lines.push(`Availability: ${ctx.availability}`, ``);

  if (ctx.experience?.length) {
    lines.push(`Work Experience:`);
    ctx.experience.forEach((e) => {
      if (e.title || e.company) {
        lines.push(`- ${e.title} at ${e.company} (${e.period || ""}): ${e.description || ""}`);
      }
    });
    lines.push(``);
  }

  if (ctx.skills) {
    const { frontend = [], backend = [], tools = [], other = [] } = ctx.skills;
    const allSkills = [...frontend, ...backend, ...tools, ...other].filter(Boolean);
    if (allSkills.length) {
      lines.push(`Skills:`);
      if (frontend.length) lines.push(`  Frontend: ${frontend.join(", ")}`);
      if (backend.length) lines.push(`  Backend: ${backend.join(", ")}`);
      if (tools.length) lines.push(`  Tools: ${tools.join(", ")}`);
      if (other.length) lines.push(`  Other: ${other.join(", ")}`);
      lines.push(``);
    }
  }

  if (ctx.projects?.length) {
    lines.push(`Projects:`);
    ctx.projects.forEach((p) => {
      if (p.name) {
        const tech = p.tech?.length ? ` (${p.tech.join(", ")})` : "";
        const link = p.link ? ` — ${p.link}` : "";
        lines.push(`- ${p.name}${tech}: ${p.description || ""}${link}`);
      }
    });
    lines.push(``);
  }

  if (ctx.education?.length) {
    lines.push(`Education:`);
    ctx.education.forEach((e) => {
      if (e.degree || e.school) {
        lines.push(`- ${e.degree} at ${e.school} (${e.year || ""})`);
      }
    });
    lines.push(``);
  }

  if (ctx.contact) {
    const { email, github, linkedin, other } = ctx.contact;
    lines.push(`Contact:`);
    if (email) lines.push(`  Email: ${email}`);
    if (github) lines.push(`  GitHub: ${github}`);
    if (linkedin) lines.push(`  LinkedIn: ${linkedin}`);
    if (other) lines.push(`  Other: ${other}`);
    lines.push(``);
  }

  if (ctx.languages_spoken?.length) {
    lines.push(`Languages spoken: ${ctx.languages_spoken.join(", ")}`, ``);
  }

  if (ctx.custom_instructions) {
    lines.push(`Additional instructions: ${ctx.custom_instructions}`);
  }

  return lines.join("\n");
};

// ─── Gemini client (lazy-init so the key is read at call time) ───────────────

let chatSession = null;

const getChatSession = () => {
  if (chatSession) return chatSession;

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error("VITE_GEMINI_API_KEY is not set.");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: buildSystemPrompt(),
  });

  chatSession = model.startChat({ history: [] });
  return chatSession;
};

// ─── Component ────────────────────────────────────────────────────────────────

const ACCENT = "#B7A2F7";
const BG_DARK = "#0e0e10";
const BG_CARD = "#1c1c21";
const BORDER = "rgba(183, 162, 247, 0.25)";

const ChatBubble = ({ language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        language === "en"
          ? "Hi! I'm Cedric's AI assistant. Ask me anything about his experience, skills, or projects!"
          : "こんにちは！セドリックのAIアシスタントです。経験やスキル、プロジェクトについて何でもどうぞ！",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    setError(null);
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setIsTyping(true);

    try {
      const chat = getChatSession();
      const result = await chat.sendMessage(text);
      const responseText = result.response.text();
      setMessages((prev) => [...prev, { role: "assistant", content: responseText }]);
    } catch (err) {
      console.error("Gemini error:", err);
      setError("Something went wrong. Please try again.");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I ran into an error. Please try again." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* ── Chat Window ──────────────────────────────────────────────────── */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "160px",
            right: "30px",
            width: "340px",
            height: "480px",
            background: BG_DARK,
            border: `1px solid ${BORDER}`,
            borderRadius: "16px",
            display: "flex",
            flexDirection: "column",
            zIndex: 9998,
            boxShadow: `0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px ${BORDER}`,
            overflow: "hidden",
            animation: "chatSlideIn 0.2s ease-out",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "14px 16px",
              borderBottom: `1px solid ${BORDER}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: BG_CARD,
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#4ade80",
                  boxShadow: "0 0 6px #4ade80",
                }}
              />
              <span style={{ color: "white", fontWeight: 600, fontSize: "14px" }}>
                {language === "en" ? "Ask about Cedric" : "セドリックについて聞く"}
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "none",
                border: "none",
                color: "#839cb5",
                cursor: "pointer",
                fontSize: "18px",
                lineHeight: 1,
                padding: "2px 6px",
                borderRadius: "6px",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#839cb5")}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "14px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              scrollbarWidth: "thin",
              scrollbarColor: `${BORDER} transparent`,
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "82%",
                    padding: "9px 13px",
                    borderRadius:
                      msg.role === "user"
                        ? "14px 14px 3px 14px"
                        : "14px 14px 14px 3px",
                    background: msg.role === "user" ? ACCENT : BG_CARD,
                    color: msg.role === "user" ? "#0e0e10" : "#d9ecff",
                    fontSize: "13px",
                    lineHeight: "1.55",
                    whiteSpace: "pre-line",
                    border: msg.role === "assistant" ? `1px solid ${BORDER}` : "none",
                    fontWeight: msg.role === "user" ? 500 : 400,
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {isTyping && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: "14px 14px 14px 3px",
                    background: BG_CARD,
                    border: `1px solid ${BORDER}`,
                    display: "flex",
                    gap: "5px",
                    alignItems: "center",
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: ACCENT,
                        display: "inline-block",
                        animation: `typingDot 1.2s ${i * 0.2}s infinite ease-in-out`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div style={{ textAlign: "center", fontSize: "11px", color: "#f87171" }}>
                {error}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            style={{
              padding: "12px",
              borderTop: `1px solid ${BORDER}`,
              display: "flex",
              gap: "8px",
              background: BG_CARD,
              flexShrink: 0,
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={language === "en" ? "Ask something…" : "質問を入力…"}
              disabled={isTyping}
              style={{
                flex: 1,
                background: BG_DARK,
                border: `1px solid ${BORDER}`,
                borderRadius: "10px",
                padding: "9px 13px",
                color: "white",
                fontSize: "13px",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = ACCENT)}
              onBlur={(e) => (e.currentTarget.style.borderColor = BORDER)}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              style={{
                background: input.trim() && !isTyping ? ACCENT : BG_DARK,
                border: `1px solid ${input.trim() && !isTyping ? ACCENT : BORDER}`,
                borderRadius: "10px",
                padding: "9px 14px",
                cursor: input.trim() && !isTyping ? "pointer" : "default",
                color: input.trim() && !isTyping ? "#0e0e10" : "#839cb5",
                fontSize: "16px",
                transition: "all 0.2s",
                flexShrink: 0,
              }}
              aria-label="Send"
            >
              ↑
            </button>
          </div>
        </div>
      )}

      {/* ── Bubble Button ────────────────────────────────────────────────── */}
      <div style={{ position: "fixed", bottom: "90px", right: "30px", zIndex: 9999 }}>
        <button
          onClick={() => setIsOpen((o) => !o)}
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            backgroundColor: isOpen ? ACCENT : "rgba(255,255,255,0.1)",
            border: `1px solid ${isOpen ? ACCENT : "rgba(255,255,255,0.2)"}`,
            backdropFilter: "blur(5px)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.25s ease",
            boxShadow: isOpen ? `0 0 20px rgba(183,162,247,0.4)` : "none",
          }}
          onMouseEnter={(e) => {
            if (!isOpen) {
              e.currentTarget.style.backgroundColor = "rgba(183,162,247,0.2)";
              e.currentTarget.style.borderColor = ACCENT;
            }
          }}
          onMouseLeave={(e) => {
            if (!isOpen) {
              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
            }
          }}
          aria-label={isOpen ? "Close chat" : "Open chat"}
        >
          <img
            src="/images/chat.png"
            alt="chat"
            style={{
              width: "22px",
              height: "22px",
              objectFit: "contain",
              filter: isOpen ? "brightness(0)" : "brightness(10)",
              transition: "filter 0.25s",
            }}
          />
        </button>
      </div>

      {/* ── Keyframe styles ──────────────────────────────────────────────── */}
      <style>{`
        @keyframes chatSlideIn {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
        @keyframes typingDot {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
          40%            { transform: scale(1);   opacity: 1;   }
        }
      `}</style>
    </>
  );
};

export default ChatBubble;
