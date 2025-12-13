/* =================================================
   app.js (공용)
   - 옵션B 스케일 유지
   - 캔버스 높이를 "마지막 썸네일" 기준으로 자동 계산
   - footer가 너무 아래로 내려가는 문제 해결
   - 스크롤업 버튼
   - 네비 active 자동 처리
================================================= */

(function () {
  const BASE_W = 1920;

  function setNavActive() {
    const nav = document.querySelector(".nav");
    if (!nav) return;

    const links = nav.querySelectorAll("a");
    const here = location.href.replace(/\/+$/, "");

    links.forEach(a => a.classList.remove("active"));

    // 현재 페이지 URL과 가장 잘 맞는 링크를 active로
    let best = null;
    let bestLen = -1;

    links.forEach(a => {
      const target = a.href.replace(/\/+$/, "");
      if (here === target || here.startsWith(target + "/")) {
        if (target.length > bestLen) {
          best = a;
          bestLen = target.length;
        }
      }
    });

    if (best) best.classList.add("active");
  }

  // "마지막 썸네일 바닥"을 찾아서 캔버스 height 자동 설정
  function fitCanvasHeight(canvas, extraGapPx) {
    const thumbs = canvas.querySelectorAll(".thumb");
    if (!thumbs.length) return;

    let maxBottom = 0;
    thumbs.forEach(t => {
      const bottom = t.offsetTop + t.offsetHeight;
      if (bottom > maxBottom) maxBottom = bottom;
    });

    // 썸네일 아래 간격(footer 올라오도록)
    canvas.style.height = (maxBottom + extraGapPx) + "px";
  }

  function setScaleAll() {
    const canvases = document.querySelectorAll(".canvas");
    canvases.forEach(canvas => {
      // 1) 캔버스 높이를 썸네일 기준으로 먼저 맞춤 (중요)
      //    footer가 마지막 썸네일 아래로 딱 붙게 만드는 핵심
      fitCanvasHeight(canvas, 120); // ✅ 마지막 썸네일 아래 간격(원하시면 80/100/140으로 변경)

      // 2) 옵션B 스케일
      const scale = Math.min(1, window.innerWidth / BASE_W);
      canvas.style.setProperty("--scale", scale);

      // 3) 스케일된 높이를 부모가 "공간"으로 인식하도록 처리
      //    (이게 없으면 footer가 겹치거나 멀어질 수 있음)
      const wrap = canvas.closest(".canvas-wrap");
      if (wrap) {
        const rawH = canvas.getBoundingClientRect().height; // scale 적용된 높이
        wrap.style.height = rawH + "px";
      }
    });
  }

  function bindScrollTop() {
    const btn = document.getElementById("scrollTopBtn");
    if (!btn) return;
    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // 메인 슬라이더가 있는 페이지만 자동 실행(없으면 그냥 패스)
  function initHeroSlider() {
    const slider = document.querySelector(".hero-slider");
    const slides = document.querySelectorAll(".hero .slide");
    const prev = document.querySelector(".hero-control.prev");
    const next = document.querySelector(".hero-control.next");
    if (!slider || !slides.length || !prev || !next) return;

    let idx = 0;
    const INTERVAL = 4500; // 자동 전환 시간
    let timer = null;
    let paused = false;

    function show(i) {
      slides.forEach(s => s.classList.remove("active"));
      slides[i].classList.add("active");
    }
    function goNext() {
      idx = (idx + 1) % slides.length;
      show(idx);
    }
    function goPrev() {
      idx = (idx - 1 + slides.length) % slides.length;
      show(idx);
    }
    function start() {
      clearInterval(timer);
      timer = setInterval(() => {
        if (!paused) goNext();
      }, INTERVAL);
    }

    next.addEventListener("click", () => { goNext(); start(); });
    prev.addEventListener("click", () => { goPrev(); start(); });

    slider.addEventListener("mouseenter", () => { paused = true; });
    slider.addEventListener("mouseleave", () => { paused = false; });

    start();
  }

  window.addEventListener("DOMContentLoaded", () => {
    setNavActive();
    bindScrollTop();
    initHeroSlider();
    setScaleAll();
  });

  window.addEventListener("resize", () => {
    setScaleAll();
  });
})();
