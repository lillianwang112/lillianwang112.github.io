(() => {
  'use strict';
  const intro = document.getElementById('valor-intro');
  const flight = intro.querySelector('.valor-flight');
  const curtain = intro.querySelector('.valor-curtain');
  const left = intro.querySelector('.valor-wing-left');
  const right = intro.querySelector('.valor-wing-right');
  const ring = intro.querySelector('.valor-ring');
  const svg = intro.querySelector('.valor-bird');
  const parts = intro.querySelector('.valor-parts');
  const resolved = intro.querySelector('.valor-resolved');
  const signature = intro.querySelector('.valor-signature');
  const signatureStrokes = [...intro.querySelectorAll('.valor-signature-stroke')];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const sessionKey = 'lillian-valor-entrance-v2';
  const duration = 2800;
  let frame = 0;
  let started = 0;
  let active = false;
  let returnFocus = null;
  const mix = (a,b,t) => a + (b-a)*t;
  const clamp = t => Math.min(1,Math.max(0,t));
  const smooth = t => {t=clamp(t);return t*t*(3-2*t);};
  function finish() {
    active = false;
    cancelAnimationFrame(frame);
    intro.hidden = true;
    document.documentElement.classList.remove('valor-intro-active');
    if (intro.contains(document.activeElement)) {
      (returnFocus || document.querySelector('.nav-logo'))?.focus({preventScroll:true});
    }
  }
  function draw(elapsed) {
    const t = clamp(elapsed / duration);
    // First show a small folded bird, then unfold it; only afterward sweep past the viewport.
    const unfold = smooth((t-.12)/.43);
    const approach = smooth(t/.65);
    const burst = Math.pow(clamp((t-.65)/.35),2);
    const baseSize = innerWidth <= 768 ? Math.min(innerWidth,innerHeight)*.82 : Math.min(Math.min(innerWidth,innerHeight)*.72,560);
    const cover = Math.max(innerWidth,innerHeight) / baseSize * 5;
    const scale = mix(.2,1.05,approach) + burst*cover;
    // Zoom the SVG camera instead of magnifying a cached bitmap: edges stay sharp.
    const viewWidth = 401.2*innerWidth/(baseSize*scale);
    const viewHeight = 401.2*innerHeight/(baseSize*scale);
    svg.setAttribute('viewBox',`${200.6-viewWidth/2} ${201.055-viewHeight/2} ${viewWidth} ${viewHeight}`);
    flight.style.opacity = String(smooth(t/.08) * (1-smooth((t-.79)/.21)));
    const squeeze = Math.cos(mix(74,0,unfold)*Math.PI/180);
    left.setAttribute('transform',`translate(194 225) scale(${squeeze} 1) rotate(${mix(22,0,unfold)}) translate(-194 -225)`);
    right.setAttribute('transform',`translate(207 225) scale(${squeeze} 1) rotate(${mix(-22,0,unfold)}) translate(-207 -225)`);
    // Swap to the uninterrupted source path once the wings are open: no clipping seams.
    const resolvedOpacity = smooth((unfold-.96)/.04);
    parts.setAttribute('opacity',String(1-resolvedOpacity));
    resolved.setAttribute('opacity',String(resolvedOpacity));
    // Draw L, then W, then the final underline as the wings unfold.
    signature.setAttribute('opacity', String(smooth((t-.19)/.04)));
    const signing = clamp((t-.21)/.39);
    const strokeWindows = [[0,.43],[.4,.88],[.86,1]];
    signatureStrokes.forEach((stroke,index) => {
      const [begin,end] = strokeWindows[index];
      stroke.setAttribute('stroke-dashoffset', String(1-clamp((signing-begin)/(end-begin))));
    });
    ring.style.opacity = String(smooth((t-.39)/.2)*(1-smooth((t-.69)/.13))*.65);
    // A real expanding hole opens in the curtain behind the bird, exposing the original site.
    const reveal = smooth((t-.63)/.32);
    curtain.style.setProperty('--opening',`${Math.hypot(innerWidth,innerHeight)*.54*reveal}px`);
    curtain.style.opacity = String(1-smooth((t-.9)/.1));
    if(t===1)finish();
  }
  function tick(now) {
    if(!active)return;
    draw(now-started);
    if(active)frame=requestAnimationFrame(tick);
  }
  function start(replay=false) {
    if(reduce.matches)return;
    finish();
    returnFocus = replay ? document.activeElement : null;
    if(replay)window.scrollTo({top:0,behavior:'instant'});
    active=true;
    intro.hidden=false;
    document.documentElement.classList.add('valor-intro-active');
    started=performance.now();
    draw(0);
    frame=requestAnimationFrame(tick);
    try { sessionStorage.setItem(sessionKey,'seen'); } catch (_) {}
  }
  intro.querySelector('.valor-skip').addEventListener('click',finish);
  document.addEventListener('keydown', e=>{if(e.key==='Escape'||e.key==='Tab')finish();});
  window.addEventListener('wheel',finish,{passive:true});
  window.addEventListener('touchstart',finish,{passive:true});
  window.addEventListener('resize',finish);
  window.addEventListener('pagehide',finish);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)finish();});
  reduce.addEventListener('change',finish);
  document.addEventListener('click',e=>{
    if(e.target.closest('.valor-replay'))start(true);
    else if(e.target.closest('a'))finish();
  });
  let seen=false;
  try {seen=sessionStorage.getItem(sessionKey)==='seen';}catch(_){seen=true;}
  if(!seen&&!reduce.matches&&!location.hash)start();
})();
