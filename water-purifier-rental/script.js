// ===========================================================
// 퓨어자카르타 정수기 렌탈 — 인터랙션 스크립트
// ===========================================================

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- 모바일 메뉴 토글 ---------- */
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.style.display === "flex";
      navLinks.style.display = isOpen ? "none" : "flex";
      navLinks.style.flexDirection = "column";
      navLinks.style.position = "absolute";
      navLinks.style.top = "64px";
      navLinks.style.left = "0";
      navLinks.style.right = "0";
      navLinks.style.background = "#ffffff";
      navLinks.style.padding = "16px 20px";
      navLinks.style.gap = "14px";
      navLinks.style.borderBottom = "1px solid #e2e8f0";
    });

    // 링크 클릭 시 메뉴 닫기 (모바일)
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 680) {
          navLinks.style.display = "none";
        }
      });
    });
  }

  /* ---------- FAQ 아코디언 ---------- */
  document.querySelectorAll(".faq-item").forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      // 다른 항목 닫기 (한 번에 하나만 열림)
      document.querySelectorAll(".faq-item.open").forEach((openItem) => {
        if (openItem !== item) {
          openItem.classList.remove("open");
          openItem.querySelector(".faq-answer").style.maxHeight = null;
        }
      });

      if (isOpen) {
        item.classList.remove("open");
        answer.style.maxHeight = null;
      } else {
        item.classList.add("open");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

  /* ---------- 상담 신청 폼 ---------- */
  const applyForm = document.getElementById("applyForm");
  const formSuccess = document.getElementById("formSuccess");

  if (applyForm) {
    applyForm.addEventListener("submit", (e) => {
      e.preventDefault();

      if (!applyForm.checkValidity()) {
        applyForm.reportValidity();
        return;
      }

      // 실제 서비스 연동 시 이 부분을 서버/스프레드시트/CRM API 호출로 교체하세요.
      const formData = new FormData(applyForm);
      const entry = Object.fromEntries(formData.entries());
      entry.submittedAt = new Date().toISOString();

      try {
        const existing = JSON.parse(localStorage.getItem("purejakarta_leads") || "[]");
        existing.push(entry);
        localStorage.setItem("purejakarta_leads", JSON.stringify(existing));
      } catch (err) {
        // localStorage 사용 불가 환경이어도 폼 제출 자체는 계속 진행
        console.warn("리드 저장 실패:", err);
      }

      formSuccess.classList.add("show");
      applyForm.reset();

      setTimeout(() => {
        formSuccess.classList.remove("show");
      }, 6000);
    });
  }
});
