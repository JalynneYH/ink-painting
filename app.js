/* =========================
   NAV ACTIVE AUTO SET
========================= */
(function setActiveNav() {
  const nav = document.getElementById("topNav");
  if (!nav) return;

  const links = nav.querySelectorAll("a");
  const currentPath = location.pathname.replace(/\/+$/, "");

  links.forEach(link => link.classList.remove("active"));

  let bestMatch = null;
  let bestLength = -1;

  links.forEach(link => {
    const linkPath = new URL(link.href).pathname.replace(/\/+$/, "");
    if (
      currentPath === linkPath ||
      (linkPath !== "/" && currentPath.startsWith(linkPath))
    ) {
      if (linkPath.length > bestLength) {
        bestMatch = link;
        bestLength = linkPath.length;
      }
    }
  });

  if (bestMatch) bestMatch.classList.add("active");
})();

/* =========================
   SCROLL TO TOP BUTTON
========================= */
const scrollBtn = document.getElementById("scrollTopBtn");
if (scrollBtn) {
  scrollBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
