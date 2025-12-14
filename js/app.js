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
   NAV ACTIVE AUTO (메인 '/' 오작동 수정 버전)
   - '/'(메인)은 오직 홈에서만 active
   - 나머지는 정확히 같은 폴더 경로로 매칭
================================================= */
(function () {
  const nav = document.getElementById("topNav");
  if (!nav) return;

  const links = Array.from(nav.querySelectorAll("a"));

  // 현재 페이지의 pathname (끝 슬래시 정리)
  const herePath = location.pathname.replace(/\/+$/, "") || "/";

  // 모두 active 제거
  links.forEach(a => a.classList.remove("active"));

  // 링크들 중 현재 경로와 가장 잘 맞는 것 찾기
  // 규칙:
  // 1) 메인('/')은 herePath가 '/'일 때만 active
  // 2) 그 외는 "정확히 같은 경로"면 active
  // 3) (옵션) detail.html 같은 경우 type에 따라 상단 메뉴를 잡고 싶으면 아래 블록 참고
  let matched = null;

  for (const a of links) {
    const url = new URL(a.href, location.origin);
    const linkPath = url.pathname.replace(/\/+$/, "") || "/";

    if (linkPath === "/") {
      if (herePath === "/") matched = a;  // ✅ 홈에서만 MAIN active
      continue;
    }

    if (herePath === linkPath) {
      matched = a;
      break;
    }
  }

  // (옵션) detail.html에서 type 파라미터로 메뉴 활성화하고 싶을 때
  // - 원치 않으면 아래 블록은 그대로 둬도 문제 없습니다.
  if (!matched && herePath.endsWith("/detail.html")) {
    const type = new URLSearchParams(location.search).get("type");
    if (type === "design") matched = links.find(a => a.href.includes("/design/"));
    if (type === "color") matched = links.find(a => a.href.includes("/color-painting/"));
    if (type === "ink") matched = links.find(a => a.href.includes("/ink-painting/"));
    if (type === "main") matched = links.find(a => new URL(a.href).pathname === "/");
  }

  if (matched) matched.classList.add("active");
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
