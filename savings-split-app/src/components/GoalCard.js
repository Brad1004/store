import React, { useState } from 'react';
import { formatWon } from '../storage';

export default function GoalCard({ goal, monthlyAllocationAmount, onDeposit, onDelete, celebrating }) {
  const [depositValue, setDepositValue] = useState('');
  const percent = Math.min(100, Math.round((goal.savedAmount / goal.targetAmount) * 100));
  const isComplete = goal.savedAmount >= goal.targetAmount;

  function handleDeposit(e) {
    e.preventDefault();
    const amount = Number(depositValue);
    if (!amount || amount <= 0) return;
    onDeposit(goal.id, amount);
    setDepositValue('');
  }

  return (
    <div className={`goal-card ${isComplete ? 'complete' : ''} ${celebrating ? 'celebrate' : ''}`}>
      {celebrating && <div className="confetti">🎉 목표 달성! 🎉</div>}
      <div className="goal-header">
        <span className="goal-icon" style={{ background: goal.color + '22' }}>
          {goal.icon}
        </span>
        <div className="goal-title">
          <strong>{goal.name}</strong>
          <span className="goal-sub">
            월 {monthlyAllocationAmount ? formatWon(monthlyAllocationAmount) : '-'} 배분 · {goal.allocationPercent}%
          </span>
        </div>
        <button className="btn-icon" title="목표 삭제" onClick={() => onDelete(goal.id)}>
          ✕
        </button>
      </div>

      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${percent}%`, background: goal.color }}
        />
      </div>
      <div className="progress-meta">
        <span>{formatWon(goal.savedAmount)}</span>
        <span className="progress-percent" style={{ color: goal.color }}>
          {percent}%
        </span>
        <span>{formatWon(goal.targetAmount)}</span>
      </div>

      {isComplete ? (
        <div className="goal-done-badge">🏆 목표 달성 완료!</div>
      ) : (
        <form className="deposit-row" onSubmit={handleDeposit}>
          <input
            type="number"
            min="1"
            placeholder="직접 입금할 금액"
            value={depositValue}
            onChange={(e) => setDepositValue(e.target.value)}
          />
          <button type="submit" className="btn-secondary">
            입금
          </button>
        </form>
      )}
    </div>
  );
}
