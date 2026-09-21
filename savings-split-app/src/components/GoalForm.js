import React, { useState } from 'react';
import { ICONS, COLORS } from '../storage';

export default function GoalForm({ remainingPercent, onAdd, onClose }) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState(ICONS[0]);
  const [color, setColor] = useState(COLORS[0]);
  const [targetAmount, setTargetAmount] = useState('');
  const [allocationPercent, setAllocationPercent] = useState(
    Math.max(0, Math.min(20, remainingPercent))
  );

  function handleSubmit(e) {
    e.preventDefault();
    const target = Number(targetAmount);
    const percent = Number(allocationPercent);
    if (!name.trim() || !target || target <= 0 || percent <= 0) return;
    onAdd({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: name.trim(),
      icon,
      color,
      targetAmount: target,
      savedAmount: 0,
      allocationPercent: percent,
      createdAt: new Date().toISOString(),
      history: [],
    });
  }

  return (
    <form className="goal-form" onSubmit={handleSubmit}>
      <h3>새 목표 만들기</h3>

      <div className="field">
        <label>목표 이름</label>
        <input
          type="text"
          placeholder="예: 내 집 마련, 결혼 자금, 유럽 여행"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
      </div>

      <div className="field">
        <label>아이콘</label>
        <div className="icon-picker">
          {ICONS.map((ic) => (
            <button
              type="button"
              key={ic}
              className={`icon-option ${icon === ic ? 'selected' : ''}`}
              onClick={() => setIcon(ic)}
            >
              {ic}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <label>색상</label>
        <div className="color-picker">
          {COLORS.map((c) => (
            <button
              type="button"
              key={c}
              className={`color-option ${color === c ? 'selected' : ''}`}
              style={{ background: c }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
      </div>

      <div className="field">
        <label>목표 금액 (원)</label>
        <input
          type="number"
          min="1"
          placeholder="예: 20000000"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
        />
      </div>

      <div className="field">
        <label>
          월급 배분 비율 (%) — 남은 여유: {remainingPercent}%
        </label>
        <input
          type="number"
          min="1"
          max="100"
          value={allocationPercent}
          onChange={(e) => setAllocationPercent(e.target.value)}
        />
      </div>

      <div className="form-actions">
        <button type="button" className="btn-ghost" onClick={onClose}>
          취소
        </button>
        <button type="submit" className="btn-primary">
          목표 추가하기
        </button>
      </div>
    </form>
  );
}
