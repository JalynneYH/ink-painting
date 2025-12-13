// HERO SLIDER
const slides = document.querySelectorAll('.hero .slide');
let idx = 0;
setInterval(()=>{
  if(!slides.length) return;
  slides[idx].classList.remove('active');
  idx = (idx+1)%slides.length;
  slides[idx].classList.add('active');
}, 5000);

// SCROLL TOP
const btn = document.getElementById('scrollTopBtn');
if(btn){
  btn.onclick = ()=>window.scrollTo({top:0,behavior:'smooth'});
}
