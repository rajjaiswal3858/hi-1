/* Scroll reveal */
const obs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');obs.unobserve(e.target);}});
},{threshold:.1,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));

/* 3D tilt on cards */
document.querySelectorAll('.card').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    card.style.transform=`perspective(600px) rotateY(${x*8}deg) rotateX(${-y*8}deg) translateZ(6px)`;
  });
  card.addEventListener('mouseleave',()=>{
    card.style.transform='perspective(600px) rotateY(0) rotateX(0) translateZ(0)';
  });
});
