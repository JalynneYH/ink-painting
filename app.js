/* ===============================
   NAV ACTIVE
================================ */
document.querySelectorAll(".nav a").forEach(a=>{
  if(a.href === location.href) a.classList.add("active");
});

/* ===============================
   SCROLL TOP BUTTON
================================ */
const topBtn = document.getElementById("scrollTopBtn");
if(topBtn){
  window.addEventListener("scroll",()=>{
    topBtn.style.display = window.scrollY > 300 ? "flex" : "none";
  });
  topBtn.onclick = ()=>window.scrollTo({top:0,behavior:"smooth"});
}

/* ===============================
   DETAIL PAGE (JSON 기반)
================================ */
(function(){
  const img = document.getElementById("detailImage");
  if(!img) return;

  const prev = document.getElementById("detailPrev");
  const next = document.getElementById("detailNext");
  const meta = document.getElementById("detailMeta");
  const desc = document.getElementById("detailDesc");

  const p = new URLSearchParams(location.search);
  const type = p.get("type") || "main";
  const id = (p.get("id")||"01").padStart(2,"0");

  let idx = 1, count = 1;

  function src(n){
    return `assets/detail/${type}/${id}/${String(n).padStart(2,"0")}.png`;
  }
  function render(){
    img.src = src(idx);
    const show = count > 1;
    if(prev) prev.style.display = show?"flex":"none";
    if(next) next.style.display = show?"flex":"none";
  }
  prev && (prev.onclick = ()=>{idx = idx>1?idx-1:count; render();});
  next && (next.onclick = ()=>{idx = idx<count?idx+1:1; render();});

  fetch("assets/detail/data.json",{cache:"no-store"})
    .then(r=>r.json())
    .then(db=>{
      const d = db?.[type]?.[id];
      if(!d) return;
      count = d.count || 1;
      meta.textContent = d.meta || "";
      desc.textContent = d.desc || "";
      document.title = d.title ? `LEE YUNHA – ${d.title}` : document.title;
      render();
    })
    .catch(render);
})();
