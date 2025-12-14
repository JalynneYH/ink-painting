/* =================================================
   OPTION B (1920 기준 캔버스 스케일 + 상단 빈공간(offset) 제거)
   - 창을 줄이면 전체가 비율대로 같이 줄어듭니다.
   - data-height: 원본 캔버스 전체 높이(px)
   - data-offset: (선택) 캔버스 상단 빈 공간(px) => 위로 당겨 제거
================================================= */
function applyCanvasScale() {
  const baseWidth = 1920;
  const vw = Math.min(window.innerWidth, document.documentElement.clientWidth);

  // 줄이면 같이 줄어들기(확대는 X)
  const scale = Math.min(1, vw / baseWidth);

  document.querySelectorAll(".canvas").forEach((canvas) => {
    canvas.style.setProperty("--scale", scale);

    const rawH = parseFloat(canvas.getAttribute("data-height")) || 0;
    const rawOffset = parseFloat(canvas.getAttribute("data-offset")) || 0;

    // ✅ 상단 빈공간 제거: 캔버스를 위로 당김
    canvas.style.marginTop = rawOffset ? (-rawOffset * scale) + "px" : "0px";

    // ✅ 실제 보이는 높이만큼 stage 높이를 잡아 footer가 떠오르거나 멀어지는 문제 방지
    const visibleH = Math.max(0, rawH - rawOffset) * scale;

    const stage = canvas.closest(".canvas-stage") || canvas.parentElement;
    if (stage && visibleH) stage.style.height = visibleH + "px";
  });
}

window.addEventListener("load", applyCanvasScale);
window.addEventListener("resize", applyCanvasScale);

/* =================================================
   NAV ACTIVE AUTO (메인 링크가 모든 페이지에서 하얘지는 문제 해결)
================================================= */
(function navActiveAuto() {
  const nav = document.getElementById("topNav");
  if (!nav) return;

  const links = nav.querySelectorAll("a");
  links.forEach((a) => a.classList.remove("active"));

  // pathname으로만 판별 (메인('/')이 startsWith로 다 걸리는 문제 방지)
  const path = location.pathname.replace(/\/+$/, "");

  // GitHub Pages 레포 분리 기준:
  // /            => MAIN
  // /design      => DESIGN
  // /color-painting => COLOR
  // /ink-painting   => INK
  let key = "MAIN";
  if (path.startsWith("/design")) key = "DESIGN";
  else if (path.startsWith("/color-painting")) key = "COLOR";
  else if (path.startsWith("/ink-painting")) key = "INK";
  else if (path === "" || path === "/") key = "MAIN";

  links.forEach((a) => {
    const text = (a.textContent || "").trim().toUpperCase();
    if (key === "MAIN" && text === "MAIN") a.classList.add("active");
    if (key === "DESIGN" && text === "DESIGN") a.classList.add("active");
    if (key === "COLOR" && text.includes("COLOR")) a.classList.add("active");
    if (key === "INK" && text.includes("INK")) a.classList.add("active");
  });
})();

/* =================================================
   SCROLL TO TOP
================================================= */
(function scrollTop() {
  const btn = document.getElementById("scrollTopBtn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();

/* =================================================
   HERO SLIDER (메인에만 있을 때만 동작)
   - 자동재생 + 페이드 + 호버시 일시정지 + 화살표 클릭
================================================= */
(function heroSlider() {
  const slider = document.querySelector(".hero-slider");
  const slides = document.querySelectorAll(".hero .slide");
  const prev = document.querySelector(".hero-control.prev");
  const next = document.querySelector(".hero-control.next");

  if (!slider || slides.length === 0) return;

  let index = 0;
  const INTERVAL = 4500;
  let timer = null;
  let paused = false;

  function show(i) {
    slides.forEach((s) => s.classList.remove("active"));
    slides[i].classList.add("active");
  }

  function nextSlide() {
    index = (index + 1) % slides.length;
    show(index);
  }

  function prevSlide() {
    index = (index - 1 + slides.length) % slides.length;
    show(index);
  }

  function start() {
    clearInterval(timer);
    timer = setInterval(() => {
      if (!paused) nextSlide();
    }, INTERVAL);
  }

  start();

  if (next) next.addEventListener("click", () => { nextSlide(); start(); });
  if (prev) prev.addEventListener("click", () => { prevSlide(); start(); });

  slider.addEventListener("mouseenter", () => (paused = true));
  slider.addEventListener("mouseleave", () => (paused = false));
})();
