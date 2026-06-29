import { useState } from "react";

export default function ConversationCard({ item, index }) {
  const [showApps, setShowApps] = useState(false);

  const speak = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-number">{index + 1}</span>
        <div className="card-text">
          <p className="english">{item.english}</p>
          <p className="korean">{item.korean}</p>
        </div>
        <button
          className="speak-btn"
          onClick={() => speak(item.english)}
          title="Listen"
          aria-label="Listen to pronunciation"
        >
          🔊
        </button>
      </div>

      <button
        className={`app-toggle ${showApps ? "open" : ""}`}
        onClick={() => setShowApps(!showApps)}
      >
        응용표현 보기 {showApps ? "▲" : "▼"}
      </button>

      {showApps && (
        <div className="applications">
          {item.applications.map((app, i) => (
            <div className="app-item" key={i}>
              <div className="app-text">
                <p className="english">{app.english}</p>
                <p className="korean">{app.korean}</p>
              </div>
              <button
                className="speak-btn small"
                onClick={() => speak(app.english)}
                title="Listen"
                aria-label="Listen to pronunciation"
              >
                🔊
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
