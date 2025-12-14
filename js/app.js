/* =================================================
   옵션B: 1920 기준 캔버스 스케일 + stage 높이 고정
================================================= */
function applyCanvasScale() {
  const canvases = document.querySelectorAll(".canvas");
  const baseWidth = 1920;
  const vw = Math.min(window.innerWidth, document.documentElement.clientWidth);
  const scale = Math.min(1, vw / baseWidth);

  canvases.forEach((canvas) => {
    canvas.style.setProperty("--scale", scale);

    const rawH = Number(canvas.dataset.height || 0);
    const rawOffset = Number(canvas.dataset.offset || 0);

    // ✅ offset이 있으면 위로 당겨서 빈 공간 제거 (메인만 사용)
    if (rawOffset > 0) {
      canvas.style.marginTop = (-rawOffset * scale) + "px";
    } else {
      canvas.style.marginTop = "0px";
    }

    // ✅ 캔버스가 차지해야 하는 "보이는 높이"
    const visibleH = Math.max(0, rawH - rawOffset) * scale;

    // ✅ footer가 위로 튀지 않도록 stage 높이를 확실히 잡음
    const stage = canvas.closest(".canvas-stage");
    if (stage && visibleH) stage.style.height = visibleH + "px";
  });
}

window.addEventListener("load", applyCanvasScale);
window.addEventListener("resize", applyCanvasScale);

/* =================================================
   NAV ACTIVE AUTO
================================================= */
(function(){
  const nav = document.getElementById("topNav");
  if(!nav) return;

  const links = nav.querySelectorAll("a");
  const here = location.href.replace(/\/+$/,"");

  links.forEach(a => a.classList.remove("active"));
  links.forEach(a => {
    const href = a.href.replace(/\/+$/,"");
    if (here === href || (href !== a.origin + "/" && here.startsWith(href))) {
      a.classList.add("active");
    }
  });
})();

/* =================================================
   SCROLL TO TOP
================================================= */
(function(){
  const btn = document.getElementById("scrollTopBtn");
  if(!btn) return;
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();

/* =================================================
   HERO SLIDER (메인에만 있을 때만)
================================================= */
(function(){
  const slider = document.querySelector(".hero-slider");
  const slides = document.querySelectorAll(".hero .slide");
  const prev = document.querySelector(".hero-control.prev");
  const next = document.querySelector(".hero-control.next");

  if(!slider || slides.length === 0) return;

  let index = 0;
  const INTERVAL = 4500;
  let timer = null;
  let paused = false;

  function show(i){
    slides.forEach(s => s.classList.remove("active"));
    slides[i].classList.add("active");
  }

  function nextSlide(){
    index = (index + 1) % slides.length;
    show(index);
  }

  function prevSlide(){
    index = (index - 1 + slides.length) % slides.length;
    show(index);
  }

  function start(){
    clearInterval(timer);
    timer = setInterval(() => {
      if(!paused) nextSlide();
    }, INTERVAL);
  }

  start();

  if(next) next.addEventListener("click", () => { nextSlide(); start(); });
  if(prev) prev.addEventListener("click", () => { prevSlide(); start(); });

  slider.addEventListener("mouseenter", () => paused = true);
  slider.addEventListener("mouseleave", () => paused = false);
})();
