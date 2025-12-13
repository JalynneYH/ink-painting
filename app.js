/* =================================================
   NAV ACTIVE AUTO
   - 현재 URL과 메뉴 링크를 비교해서 active 처리
================================================= */
(function () {
  const nav = document.getElementById("topNav");
  if (!nav) return;

  const links = Array.from(nav.querySelectorAll("a"));
  const current = new URL(window.location.href);

  // 현재 path 끝의 '/' 제거해서 비교 안정화
  const curPath = current.pathname.replace(/\/+$/, "") || "/";

  links.forEach(a => a.classList.remove("active"));

  links.forEach(a => {
    let linkUrl;
    try {
      linkUrl = new URL(a.href, window.location.href);
    } catch {
      return;
    }

    const linkPath = linkUrl.pathname.replace(/\/+$/, "") || "/";

    // GitHub Pages 프로젝트 사이트는 /design 같은 prefix가 붙으므로
    // "현재 경로가 링크 경로로 시작"하면 active로 처리
    if (curPath === linkPath || (linkPath !== "/" && curPath.startsWith(linkPath))) {
      a.classList.add("active");
    }
  });
})();

/* =================================================
   SCROLL TO TOP
================================================= */
(function () {
  const btn = document.getElementById("scrollTopBtn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();
