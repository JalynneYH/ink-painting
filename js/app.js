/* =================================================
   CANVAS SCALE + 실제 썸네일 최하단 기준 높이 계산
================================================= */
function applyCanvasScale() {
  const baseWidth = 1920;
  const vw = Math.min(window.innerWidth, document.documentElement.clientWidth);
  const scale = Math.min(1, vw / baseWidth);

  document.querySelectorAll(".canvas").forEach(canvas => {
    canvas.style.setProperty("--scale", scale);

    // offset (메인은 사용, 잉크/컬러는 0)
    const offset = Number(canvas.dataset.offset || 0);
    canvas.style.marginTop = offset ? (-offset * scale) + "px" : "0px";

    /* ✅ 핵심: 실제 썸네일 최하단 계산 */
    let maxBottom = 0;
    const thumbs = canvas.querySelectorAll(".thumb");

    thumbs.forEach(t => {
      const top = parseFloat(t.style.top || 0);
      const height = parseFloat(t.style.height || 0);
      const bottom = top + height;
      if (bottom > maxBottom) maxBottom = bottom;
    });

    /* scale 적용 */
    const visibleHeight = maxBottom * scale;

    /* canvas-stage 높이 고정 */
    const stage = canvas.closest(".canvas-stage");
    if (stage) {
      stage.style.height = visibleHeight + "px";
    }
  });
}

window.addEventListener("load", applyCanvasScale);
window.addEventListener("resize", applyCanvasScale);
