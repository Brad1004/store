import { useState } from "react";
import conversationGroups from "./data/conversations";
import ConversationCard from "./components/ConversationCard";
import "./App.css";

export default function App() {
  const [groupIndex, setGroupIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadGroup = (index) => {
    setLoading(true);
    setTimeout(() => {
      setGroupIndex(index);
      setLoading(false);
    }, 300);
  };

  const handleNext = () => {
    if (groupIndex === null) return loadGroup(0);
    loadGroup((groupIndex + 1) % conversationGroups.length);
  };

  const speakAll = () => {
    if (groupIndex === null) return;
    window.speechSynthesis.cancel();
    const group = conversationGroups[groupIndex];
    let i = 0;
    const speakNext = () => {
      if (i >= group.length) return;
      const utterance = new SpeechSynthesisUtterance(group[i].english);
      utterance.lang = "en-US";
      utterance.rate = 0.85;
      utterance.onend = () => {
        i++;
        setTimeout(speakNext, 600);
      };
      window.speechSynthesis.speak(utterance);
    };
    speakNext();
  };

  const currentGroup = groupIndex !== null ? conversationGroups[groupIndex] : null;

  return (
    <div className="app">
      <header className="app-header">
        <h1>💬 일상 영어회화</h1>
        <p className="subtitle">실생활에서 바로 쓰는 영어표현</p>
      </header>

      <div className="controls">
        <button className="btn-primary" onClick={handleNext} disabled={loading}>
          {loading ? "로딩 중..." : groupIndex === null ? "시작하기 ▶" : "다음 5개 보기 ▶"}
        </button>
        {currentGroup && (
          <button className="btn-speak-all" onClick={speakAll} title="모두 듣기">
            🔊 전체 듣기
          </button>
        )}
      </div>

      {groupIndex !== null && (
        <div className="progress">
          {conversationGroups.map((_, i) => (
            <button
              key={i}
              className={`dot ${i === groupIndex ? "active" : ""}`}
              onClick={() => loadGroup(i)}
              aria-label={`그룹 ${i + 1}`}
            />
          ))}
        </div>
      )}

      <main className="card-list">
        {currentGroup &&
          currentGroup.map((item, index) => (
            <ConversationCard key={item.id} item={item} index={index} />
          ))}
      </main>

      {!currentGroup && (
        <div className="intro">
          <div className="intro-icon">🗣️</div>
          <p>버튼을 클릭하면 실생활 영어회화 5개를 보여드립니다.</p>
          <p>각 표현의 응용표현과 원어민 발음도 함께 확인하세요!</p>
        </div>
      )}
    </div>
  );
}
