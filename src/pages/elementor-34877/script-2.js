function switchTab(i){
  document.querySelectorAll('.tab').forEach((t,j)=>t.classList.toggle('active',i===j));
  document.querySelectorAll('.panel').forEach((p,j)=>p.classList.toggle('active',i===j));
  // animate progress bars in new active panel
  setTimeout(()=>{
    document.querySelectorAll('.panel.active .vs-fill').forEach(el=>{
      el.style.width='0%';
      requestAnimationFrame(()=>requestAnimationFrame(()=>{
        el.style.width=el.dataset.w;
      }));
    });
  },50);
}

// initial bar animation on load
const obs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      document.querySelectorAll('.panel.active .vs-fill').forEach(el=>{
        el.style.width=el.dataset.w;
      });
      obs.disconnect();
    }
  });
},{threshold:.3});
obs.observe(document.getElementById('s2'));
