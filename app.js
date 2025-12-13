/* =================================================
   1) NAV ACTIVE AUTO (레포 분리/옵션B 대응)
================================================= */
(function () {
  const nav = document.getElementById("topNav");
  if (!nav) return;

  const links = nav.querySelectorAll("a");
  const currentPath = location.pathname.replace(/\/+$/, "") || "/";

  links.forEach((a) => a.classList.remove("active"));

  links.forEach((a) => {
    const linkPath = new URL(a.href).pathname.replace(/\/+$/, "") || "/";
    if (currentPath === linkPath || (linkPath !== "/" && currentPath.startsWith(linkPath))) {
      a.classList.add("active");
    }
  });
})();

/* =================================================
   2) SCROLL TOP BUTTON
================================================= */
(function () {
  const btn = document.getElementById("scrollTopBtn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();

/* =================================================
   3) RESPONSIVE SCALE (1920 좌표 캔버스 스케일링)
   - stage 높이도 스케일에 맞춰 자동 계산
================================================= */
(function () {
  const stages = document.querySelectorAll("[data-canvas-height]");
  if (!stages.length) return;

  function applyScale() {
    const base = 1920;
    const vw = window.innerWidth;

    // ✅ 창 크기에 따라 자연스럽게 늘었다/줄었다 (너무 과도한 확대는 제한)
    const scale = Math.max(0.5, Math.min(1.25, vw / base));
    document.documentElement.style.setProperty("--scale", scale);

    stages.forEach((stage) => {
      const h = Number(stage.getAttribute("data-canvas-height")) || 0;
      // scale 된 만큼 stage가 차지할 "실제 높이"를 반영해야 아래가 안 겹침
      stage.style.height = Math.ceil(h * scale) + "px";
    });
  }

  window.addEventListener("resize", applyScale);
  applyScale();
})();

/* =================================================
   4) HERO SLIDER (메인에만 있을 때만 동작)
   - 자동 전환 + 페이드 + 마우스 올리면 일시정지 + 화살표 수동
================================================= */
(function () {
  const slider = document.querySelector(".hero-slider");
  const slides = document.querySelectorAll(".hero .slide");
  const prev = document.querySelector(".hero-control.prev");
  const next = document.querySelector(".hero-control.next");

  if (!slider || slides.length === 0) return; // ✅ 다른 페이지(슬라이드 없음) 에러 방지

  let index = 0;
  const INTERVAL = 4500; // ✅ 자동전환시간(원하면 숫자만 바꾸면 됨)
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

  // 시작
  start();

  // 클릭
  if (next) next.addEventListener("click", () => { nextSlide(); start(); });
  if (prev) prev.addEventListener("click", () => { prevSlide(); start(); });

  // ✅ 마우스 올리면 자동 재생 일시정지
  slider.addEventListener("mouseenter", () => (paused = true));
  slider.addEventListener("mouseleave", () => (paused = false));
})();
