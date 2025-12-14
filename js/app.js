/* =================================================
   CANVAS SCALE (옵션B) + 실제 썸네일 최하단 기준 높이 계산
   ✅ t01~ 좌표가 "CSS 클래스"에 있어도 정상 동작 (getComputedStyle 사용)
================================================= */
function applyCanvasScale() {
  const baseWidth = 1920;
  const vw = Math.min(window.innerWidth, document.documentElement.clientWidth);
  const scale = Math.min(1, vw / baseWidth);

  document.querySelectorAll(".canvas").forEach((canvas) => {
    // 1) 스케일 적용
    canvas.style.setProperty("--scale", scale);

    // 2) (메인에서만 쓰는) offset 지원 — 잉크/컬러는 보통 0
    const offset = Number(canvas.dataset.offset || 0);
    canvas.style.marginTop = offset ? (-offset * scale) + "px" : "0px";

    // 3) ✅ 실제 썸네일 최하단 계산 (CSS에 박힌 top/height도 읽힘)
    let maxBottom = 0;
    const thumbs = canvas.querySelectorAll(".thumb");

    thumbs.forEach((thumb) => {
      const cs = window.getComputedStyle(thumb);
      const top = parseFloat(cs.top) || 0;
      const height = parseFloat(cs.height) || 0;
      const bottom = top + height;
      if (bottom > maxBottom) maxBottom = bottom;
    });

    // 4) stage 높이 설정 (footer가 아래로 밀리도록)
    const stage = canvas.closest(".canvas-stage");
    if (!stage) return;

    // maxBottom이 0이면(혹시 로딩/렌더 타이밍) data-height로 fallback
    const fallbackH = Number(canvas.dataset.height || 0);
    const rawVisible = maxBottom > 0 ? (maxBottom - offset) : Math.max(0, fallbackH - offset);
    const visibleH = rawVisible * scale;

    stage.style.height = visibleH + "px";
  });
}

window.addEventListener("load", applyCanvasScale);
window.addEventListener("resize", applyCanvasScale);

/* =================================================
   NAV ACTIVE AUTO (있으면 유지)
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
