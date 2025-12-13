(function () {
  // =================================================
  // 1) NAV active (현재 경로에 따라 active 표시)
  // =================================================
  const links = document.querySelectorAll(".nav a");
  const path = location.pathname;

  links.forEach(a => {
    const href = a.getAttribute("href") || "";
    // 절대 URL도 포함해서 비교
    if (href.includes("/design/") && path.includes("/design/")) a.classList.add("active");
    else if (href.includes("/color-painting/") && path.includes("/color-painting/")) a.classList.add("active");
    else if (href.includes("/ink-painting/") && path.includes("/ink-painting/")) a.classList.add("active");
    else if ((href === "https://jalynneyh.github.io/" || href === "/") && (path === "/" || path === "/index.html")) a.classList.add("active");
  });

  // =================================================
  // 2) Canvas scale (옵션B: 1920 기준 스케일)
  // =================================================
  function applyCanvasScale() {
    const canvases = document.querySelectorAll(".canvas");
    canvases.forEach(canvas => {
      const baseW = 1920;
      const viewportW = document.documentElement.clientWidth;
      const scale = Math.min(viewportW / baseW, 1);

      canvas.style.setProperty("--scale", scale.toString());

      // stage 높이 확보 (푸터가 위로 올라오는 문제 방지)
      const stage = canvas.closest(".canvas-stage") || canvas.closest(".stage");
      const baseH = parseFloat(canvas.getAttribute("data-height") || "0");
      const yShift = parseFloat(getComputedStyle(canvas).getPropertyValue("--yShift")) || 0;

      // yShift가 음수면 실제 필요한 높이가 줄어듦
      const effectiveH = Math.max(0, baseH + yShift);
      const scaledH = effectiveH * scale;

      if (stage) {
        stage.style.minHeight = `${scaledH}px`;
      }
    });
  }
  window.addEventListener("resize", applyCanvasScale);
  window.addEventListener("load", applyCanvasScale);

  // =================================================
  // 3) Scroll to top
  // =================================================
  const btn = document.getElementById("scrollTopBtn");
  if (btn) {
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  // =================================================
  // 4) Main hero slider (존재할 때만)
  // =================================================
  const slider = document.querySelector(".hero-slider");
  if (slider) {
    const slides = Array.from(slider.querySelectorAll(".slide"));
    const prev = slider.querySelector(".hero-control.prev");
    const next = slider.querySelector(".hero-control.next");
    let i = 0;

    function show(n) {
      slides[i].classList.remove("active");
      i = (n + slides.length) % slides.length;
      slides[i].classList.add("active");
    }

    if (prev) prev.addEventListener("click", () => show(i - 1));
    if (next) next.addEventListener("click", () => show(i + 1));

    setInterval(() => show(i + 1), 5500);
  }
})();
