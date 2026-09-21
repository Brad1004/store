import React, { useState } from 'react';
import { formatWon } from '../storage';

export default function IncomeSetup({ monthlyIncome, onSave }) {
  const [editing, setEditing] = useState(monthlyIncome === 0);
  const [value, setValue] = useState(monthlyIncome || '');

  function handleSubmit(e) {
    e.preventDefault();
    const num = Number(value);
    if (!num || num <= 0) return;
    onSave(num);
    setEditing(false);
  }

  if (!editing) {
    return (
      <div className="income-card">
        <div>
          <span className="income-label">이번 달 월급</span>
          <strong className="income-value">{formatWon(monthlyIncome)}</strong>
        </div>
        <button className="btn-ghost" onClick={() => setEditing(true)}>
          수정
        </button>
      </div>
    );
  }

  return (
    <form className="income-card income-form" onSubmit={handleSubmit}>
      <label className="income-label" htmlFor="income-input">
        월급(수입)을 입력해 주세요
      </label>
      <div className="income-input-row">
        <input
          id="income-input"
          type="number"
          min="0"
          placeholder="예: 3000000"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
        />
        <button type="submit" className="btn-primary">
          저장
        </button>
      </div>
    </form>
  );
}
