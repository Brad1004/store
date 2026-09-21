import React, { useEffect, useMemo, useState } from 'react';
import IncomeSetup from './components/IncomeSetup';
import GoalForm from './components/GoalForm';
import GoalCard from './components/GoalCard';
import {
  loadData,
  saveData,
  currentMonthKey,
  previousMonthKey,
  getLevel,
  formatWon,
} from './storage';
import './App.css';

export default function App() {
  const [data, setData] = useState(loadData);
  const [showForm, setShowForm] = useState(false);
  const [celebratingId, setCelebratingId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    saveData(data);
  }, [data]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  const totalAllocated = useMemo(
    () => data.goals.reduce((sum, g) => sum + Number(g.allocationPercent || 0), 0),
    [data.goals]
  );
  const remainingPercent = Math.max(0, 100 - totalAllocated);

  const totalSaved = useMemo(
    () => data.goals.reduce((sum, g) => sum + g.savedAmount, 0),
    [data.goals]
  );
  const totalTarget = useMemo(
    () => data.goals.reduce((sum, g) => sum + g.targetAmount, 0),
    [data.goals]
  );
  const overallPercent = totalTarget > 0 ? Math.min(100, Math.round((totalSaved / totalTarget) * 100)) : 0;
  const { current: level, next: nextLevel } = getLevel(totalSaved);

  const thisMonth = currentMonthKey();
  const alreadyRanThisMonth = data.lastRunMonth === thisMonth;

  function handleSaveIncome(amount) {
    setData((prev) => ({ ...prev, monthlyIncome: amount }));
  }

  function handleAddGoal(goal) {
    setData((prev) => ({ ...prev, goals: [...prev.goals, goal] }));
    setShowForm(false);
    setToast(`'${goal.name}' 목표가 추가되었어요! 🎯`);
  }

  function handleDeleteGoal(id) {
    setData((prev) => ({ ...prev, goals: prev.goals.filter((g) => g.id !== id) }));
  }

  function applyDeposit(goals, id, amount, monthKey) {
    return goals.map((g) => {
      if (g.id !== id) return g;
      const wasComplete = g.savedAmount >= g.targetAmount;
      const nextSaved = g.savedAmount + amount;
      const nowComplete = nextSaved >= g.targetAmount;
      if (!wasComplete && nowComplete) {
        triggerCelebration(id);
      }
      return {
        ...g,
        savedAmount: nextSaved,
        history: [...g.history, { date: monthKey, amount }],
      };
    });
  }

  function triggerCelebration(id) {
    setCelebratingId(id);
    setTimeout(() => setCelebratingId((cur) => (cur === id ? null : cur)), 2600);
  }

  function handleManualDeposit(id, amount) {
    setData((prev) => ({
      ...prev,
      goals: applyDeposit(prev.goals, id, amount, currentMonthKey()),
    }));
    setToast(`${formatWon(amount)} 입금 완료! 💪`);
  }

  function handleRunMonthlyDistribution() {
    if (data.monthlyIncome <= 0) {
      setToast('먼저 월급을 입력해 주세요.');
      return;
    }
    if (alreadyRanThisMonth) {
      setToast('이번 달 분배는 이미 완료했어요. 다음 달에 다시 만나요! 📅');
      return;
    }
    setData((prev) => {
      let goals = prev.goals;
      for (const g of prev.goals) {
        if (g.savedAmount >= g.targetAmount) continue;
        const amount = Math.round((prev.monthlyIncome * g.allocationPercent) / 100);
        if (amount <= 0) continue;
        goals = applyDeposit(goals, g.id, amount, thisMonth);
      }
      const isConsecutive = prev.lastRunMonth === previousMonthKey(thisMonth);
      const streak = prev.lastRunMonth === null ? 1 : isConsecutive ? prev.streak + 1 : 1;
      return { ...prev, goals, lastRunMonth: thisMonth, streak };
    });
    setToast('이번 달 월급이 목표별로 배분되었어요! 🎉');
  }

  const activeGoals = data.goals.filter((g) => g.savedAmount < g.targetAmount);
  const completedGoals = data.goals.filter((g) => g.savedAmount >= g.targetAmount);

  return (
    <div className="app">
      <header className="app-header">
        <h1>💸 통장 쪼개기</h1>
        <p className="tagline">월급을 목표별로 나눠서, 부자들의 저축 습관을 따라해 보세요</p>
      </header>

      <IncomeSetup monthlyIncome={data.monthlyIncome} onSave={handleSaveIncome} />

      <section className="summary-grid">
        <div className="summary-card">
          <span className="summary-label">총 저축액</span>
          <strong>{formatWon(totalSaved)}</strong>
        </div>
        <div className="summary-card">
          <span className="summary-label">전체 목표 달성률</span>
          <strong>{overallPercent}%</strong>
        </div>
        <div className="summary-card">
          <span className="summary-label">연속 저축 개월</span>
          <strong>🔥 {data.streak}개월</strong>
        </div>
        <div className="summary-card">
          <span className="summary-label">현재 레벨</span>
          <strong>Lv.{level.level} {level.name}</strong>
          {nextLevel && (
            <span className="level-next">
              다음 레벨까지 {formatWon(nextLevel.min - totalSaved)}
            </span>
          )}
        </div>
      </section>

      <section className="distribute-section">
        <button
          className="btn-distribute"
          onClick={handleRunMonthlyDistribution}
          disabled={alreadyRanThisMonth || data.goals.length === 0}
        >
          {alreadyRanThisMonth ? '✅ 이번 달 배분 완료' : '📤 이번 달 월급 자동 배분하기'}
        </button>
        <p className="allocation-note">
          배분 비율 사용 중: <strong>{totalAllocated}%</strong> · 남은 여유: {remainingPercent}%
        </p>
      </section>

      <section className="goals-section">
        <div className="goals-section-header">
          <h2>목표 ({activeGoals.length})</h2>
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            + 목표 추가
          </button>
        </div>

        {showForm && (
          <GoalForm
            remainingPercent={remainingPercent}
            onAdd={handleAddGoal}
            onClose={() => setShowForm(false)}
          />
        )}

        {activeGoals.length === 0 && !showForm && (
          <div className="empty-state">
            집 사기, 결혼 자금, 여행 자금처럼 이루고 싶은 목표를 추가해 보세요!
          </div>
        )}

        <div className="goal-grid">
          {activeGoals.map((g) => (
            <GoalCard
              key={g.id}
              goal={g}
              monthlyAllocationAmount={Math.round((data.monthlyIncome * g.allocationPercent) / 100)}
              onDeposit={handleManualDeposit}
              onDelete={handleDeleteGoal}
              celebrating={celebratingId === g.id}
            />
          ))}
        </div>

        {completedGoals.length > 0 && (
          <>
            <h2 className="completed-title">🏆 달성한 목표 ({completedGoals.length})</h2>
            <div className="goal-grid">
              {completedGoals.map((g) => (
                <GoalCard
                  key={g.id}
                  goal={g}
                  monthlyAllocationAmount={0}
                  onDeposit={handleManualDeposit}
                  onDelete={handleDeleteGoal}
                  celebrating={celebratingId === g.id}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
