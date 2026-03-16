# Round 2 — Push It Further: Claude Code Enhancement Instructions

## Context
You are enhancing `index.html` — Lillian Wang's single-file personal portfolio site. Round 1 added: animated gradient mesh, constellation canvas, glassmorphism overlays, loader, status widget, bento tilt, click ripple, cursor glow, diamond dividers, fun pill animations, blur-up images, reveal variants, animated underlines, custom selection, watermark glow, and `prefers-reduced-motion` support.

This round leverages **external CDN libraries** to create jaw-dropping, award-winning visual polish. Keep everything in the single HTML file.

---

## Hard Constraints (DO NOT BREAK)
- **Single HTML file** — no separate CSS/JS files
- **Do NOT change typography** — Cormorant Garamond, DM Sans, JetBrains Mono stay
- **Do NOT change the crimson color theme** or CSS variable names
- **Do NOT change content/copy, nav structure, or section order**
- **Do NOT remove any existing effects** — only enhance or layer on top
- **Responsive**: effects should degrade gracefully on mobile ≤768px
- **`prefers-reduced-motion`**: all new animations must be disabled for users who prefer reduced motion

---

## CDN Libraries to Load (add in `<head>`, after Google Fonts)

```html
<!-- GSAP + ScrollTrigger + SplitText (Club GreenSock public CDN) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" defer></script>

<!-- Lenis smooth scroll -->
<script src="https://unpkg.com/lenis@1.1.14/dist/lenis.min.js" defer></script>
```

**Important**: Add `defer` to all script tags so they don't block rendering. The site's own `<script>` block at the bottom should be wrapped to wait for these libraries to load (see Phase 6).

---

## Phase 1 — Lenis Smooth Scroll

### Goal
Replace the browser's default scroll with Lenis for buttery-smooth, momentum-based scrolling that makes every interaction feel premium.

### Instructions

1. **Remove** `html { scroll-behavior: smooth; }` from the CSS (Lenis handles this).

2. **Initialize Lenis** at the very top of the JS section (inside the DOMContentLoaded/load wrapper from Phase 6):

```js
/* LENIS SMOOTH SCROLL */
const lenis = new Lenis({
  duration: 1.15,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  smoothWheel: true,
});
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);
```

3. **Connect Lenis to GSAP ScrollTrigger** so all scroll-triggered animations respect Lenis:
```js
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

4. **Wire up nav anchor links** to use Lenis instead of native smooth scroll:
```js
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) lenis.scrollTo(target, { offset: -70 });
  });
});
```

5. **Mobile**: Disable Lenis on mobile (≤768px) — call `lenis.destroy()` if `innerWidth <= 768`.

6. **Reduced motion**: If `prefers-reduced-motion` is active, don't initialize Lenis at all.

---

## Phase 2 — GSAP ScrollTrigger Powered Reveals

### Goal
Replace the existing IntersectionObserver reveals with GSAP ScrollTrigger for more cinematic, choreographed entrance animations with scrub-linked parallax.

### Instructions

1. **Remove** the existing IntersectionObserver code (items #7 and #8 in the JS) that handles `.reveal`, `.reveal-left`, `.reveal-right`, `.reveal-scale` classes. Keep the CSS classes themselves (they provide initial hidden state).

2. **Replace with GSAP-powered reveals**:

```js
/* GSAP REVEALS */
gsap.registerPlugin(ScrollTrigger);

// Standard fade-up reveals
gsap.utils.toArray('.reveal').forEach((el, i) => {
  gsap.fromTo(el,
    { opacity: 0, y: 30 },
    {
      opacity: 1, y: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
      delay: el.classList.contains('r1') ? 0.07 :
             el.classList.contains('r2') ? 0.14 :
             el.classList.contains('r3') ? 0.21 :
             el.classList.contains('r4') ? 0.28 : 0,
    }
  );
});

// Slide-in from left
gsap.utils.toArray('.reveal-left').forEach(el => {
  gsap.fromTo(el,
    { opacity: 0, x: -40 },
    { opacity: 1, x: 0, duration: 0.75, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' }
    }
  );
});

// Slide-in from right
gsap.utils.toArray('.reveal-right').forEach(el => {
  gsap.fromTo(el,
    { opacity: 0, x: 40 },
    { opacity: 1, x: 0, duration: 0.75, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' }
    }
  );
});

// Scale-in
gsap.utils.toArray('.reveal-scale').forEach(el => {
  gsap.fromTo(el,
    { opacity: 0, scale: 0.88 },
    { opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.4)',
      scrollTrigger: { trigger: el, start: 'top 88%' }
    }
  );
});
```

3. **Keep** the JS that applies `.reveal-left`, `.reveal-right`, `.reveal-scale` classes to timeline rows, research side cards, and now cards (items #8 in existing JS). Those just add classes; the GSAP code above handles the actual animation.

4. **New: Section heading stagger** — For each `h2` and `.sec-desc` inside `.sec`, animate them as a staggered pair:

```js
document.querySelectorAll('.sec').forEach(sec => {
  const h = sec.querySelector('h2');
  const d = sec.querySelector('.sec-desc');
  const e = sec.querySelector('.eyebrow');
  const els = [e, h, d].filter(Boolean);
  gsap.fromTo(els,
    { opacity: 0, y: 24 },
    {
      opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
      stagger: 0.1,
      scrollTrigger: { trigger: sec, start: 'top 80%' },
    }
  );
});
```

---

## Phase 3 — Parallax Depth Layers

### Goal
Add subtle GSAP-driven parallax to create depth and visual richness as the user scrolls.

### Instructions

1. **Hero section parallax** — Make the hero background mesh, constellation canvas, math glyphs, and watermark all move at different rates:

```js
/* HERO PARALLAX */
gsap.to('.hero-bg', {
  yPercent: 18,
  ease: 'none',
  scrollTrigger: {
    trigger: '#hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 0.8,
  }
});
gsap.to('#constellation', {
  yPercent: 12,
  ease: 'none',
  scrollTrigger: {
    trigger: '#hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 0.6,
  }
});
gsap.to('#mathbg', {
  yPercent: -8,
  ease: 'none',
  scrollTrigger: {
    trigger: '#hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1,
  }
});
```

2. **Remove** the existing JS watermark parallax (item #9 in existing JS, the `addEventListener('scroll'...` for `.hero-watermark`). Replace with a GSAP version:

```js
if (document.querySelector('.hero-watermark')) {
  gsap.to('.hero-watermark', {
    yPercent: 25,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.2,
    }
  });
}
```

3. **Project card images parallax** — Make project card images shift slightly on scroll for a Ken Burns feel:

```js
document.querySelectorAll('.pc-img img').forEach(img => {
  gsap.to(img, {
    yPercent: -8,
    ease: 'none',
    scrollTrigger: {
      trigger: img.closest('.pc'),
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.5,
    }
  });
});
```

For this to work, add CSS to `.pc-img`:
```css
.pc-img img { will-change: transform; }
```
(This is already partially set; just ensure `.pc-img` has `overflow: hidden` which it does.)

4. **Section index text parallax** — Make the vertical `.sec-index` text scroll at a different rate:

```js
document.querySelectorAll('.sec-index').forEach(idx => {
  gsap.to(idx, {
    yPercent: -30,
    ease: 'none',
    scrollTrigger: {
      trigger: idx.closest('.sec'),
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.8,
    }
  });
});
```

---

## Phase 4 — Enhanced Loading Experience

### Goal
Transform the loader from a simple pulse into a cinematic GSAP-powered entrance sequence.

### Instructions

1. **Update the loader HTML** to:
```html
<div id="loader" aria-hidden="true">
  <div class="loader-inner">
    <span class="loader-init">LW</span>
    <div class="loader-bar"><div class="loader-fill"></div></div>
  </div>
</div>
```

2. **Add CSS for the loader bar**:
```css
.loader-inner{display:flex;flex-direction:column;align-items:center;gap:18px}
.loader-bar{width:120px;height:2px;background:var(--bdr2);border-radius:1px;overflow:hidden}
.loader-fill{width:0%;height:100%;background:linear-gradient(90deg,var(--r),var(--r3));border-radius:1px}
```

3. **Replace the existing loader JS** (item #1) with a GSAP timeline:

```js
/* LOADING SEQUENCE */
const loader = document.getElementById('loader');
const loaderTL = gsap.timeline();

loaderTL
  .to('.loader-fill', {
    width: '100%',
    duration: 0.7,
    ease: 'power2.inOut',
  })
  .to('.loader-init', {
    scale: 1.12,
    duration: 0.25,
    ease: 'power2.in',
  })
  .to('.loader-init', {
    scale: 0.9,
    opacity: 0,
    duration: 0.3,
    ease: 'power2.in',
  })
  .to('.loader-bar', {
    opacity: 0,
    duration: 0.2,
  }, '<0.1')
  .to(loader, {
    yPercent: -100,
    duration: 0.6,
    ease: 'power3.inOut',
    onComplete: () => {
      loader.style.display = 'none';
      // Trigger hero entrance after loader
      heroEntrance();
    }
  });
```

4. **Hero entrance function** — After the loader clears, stagger-animate the hero elements:

```js
function heroEntrance() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl
    .fromTo('.badge-row', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 })
    .fromTo('.hero-name', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.65 }, '-=0.2')
    .fromTo('.hero-kicker', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
    .fromTo('.hero-bio', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.25')
    .fromTo('.fun-row', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4 }, '-=0.2')
    .fromTo('.hero-ctas', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4 }, '-=0.15')
    .fromTo('.chips', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4 }, '-=0.1')
    .fromTo('.hero-r', { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.7 }, '-=0.5')
    .fromTo('.hero-foot', { opacity: 0 }, { opacity: 1, duration: 0.5 }, '-=0.3');
}
```

5. **Remove the existing `.fu` animation delays** from the hero elements' class attributes (the `d0`, `d1`, `d2`... classes). The GSAP hero entrance replaces these. Keep the `.fu` class itself so elements start hidden (opacity: 0), but change the CSS `.fu` rule:

```css
.fu { opacity: 0; }
/* Remove the animation: fadeUp line and .d0-.d5 delay rules */
```

The GSAP heroEntrance handles all the staggered timing now.

---

## Phase 5 — Scroll-Linked Progress & Section Indicators

### Goal
Upgrade the scroll progress bar and add a floating section indicator.

### Instructions

1. **Upgrade the progress bar** — Replace the existing JS scroll listener (item #2) with GSAP:

```js
gsap.to('#progress-bar', {
  width: '100%',
  ease: 'none',
  scrollTrigger: {
    trigger: document.documentElement,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.3,
  }
});
```

2. **Add a floating current-section indicator** on the left side:

**HTML** (add after `#status-widget`):
```html
<div id="sec-indicator" aria-hidden="true">
  <span class="si-line"></span>
  <span class="si-text"></span>
</div>
```

**CSS**:
```css
#sec-indicator{
  position:fixed;left:24px;top:50%;transform:translateY(-50%);
  z-index:9996;display:flex;flex-direction:column;align-items:center;gap:8px;
  opacity:0;transition:opacity .4s;pointer-events:none;
}
#sec-indicator.visible{opacity:1}
.si-line{width:1px;height:28px;background:var(--r);opacity:.4}
.si-text{
  writing-mode:vertical-rl;transform:rotate(180deg);
  font-family:var(--mono);font-size:.55rem;letter-spacing:.14em;
  text-transform:uppercase;color:var(--r);opacity:.6;
}
@media(max-width:1100px){#sec-indicator{display:none}}
```

**JS**:
```js
const secIndicator = document.getElementById('sec-indicator');
const siText = secIndicator?.querySelector('.si-text');

document.querySelectorAll('.sec').forEach(sec => {
  ScrollTrigger.create({
    trigger: sec,
    start: 'top 50%',
    end: 'bottom 50%',
    onEnter: () => updateSecIndicator(sec),
    onEnterBack: () => updateSecIndicator(sec),
  });
});

function updateSecIndicator(sec) {
  if (!secIndicator || !siText) return;
  const label = sec.querySelector('.eyebrow')?.textContent || sec.id || '';
  siText.textContent = label;
  secIndicator.classList.add('visible');
}

// Hide indicator in hero
ScrollTrigger.create({
  trigger: '#hero',
  start: 'top top',
  end: 'bottom 50%',
  onEnter: () => secIndicator?.classList.remove('visible'),
  onEnterBack: () => secIndicator?.classList.remove('visible'),
});
```

---

## Phase 6 — Script Loading Wrapper

### Goal
Ensure all JS runs after external libraries (GSAP, Lenis) are loaded.

### Instructions

**Wrap the entire `<script>` block** content in a load handler:

```js
window.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- LOADING SCREEN (runs immediately, before GSAP check) ----
  // ... loader code from Phase 4 ...

  // ---- WAIT FOR GSAP ----
  function initSite() {
    // All other JS goes here (Lenis, GSAP reveals, parallax, etc.)
    // ... Phases 1-5 code ...
    // ... Existing items 3-20 (grain, cursor glow, etc.) ...
  }

  // Check if GSAP loaded (defer scripts)
  if (typeof gsap !== 'undefined') {
    initSite();
  } else {
    // Fallback: wait for it
    const check = setInterval(() => {
      if (typeof gsap !== 'undefined') {
        clearInterval(check);
        initSite();
      }
    }, 50);
    // Safety timeout — run without GSAP after 3s
    setTimeout(() => {
      clearInterval(check);
      if (typeof gsap === 'undefined') {
        // Fallback: just show everything
        document.querySelectorAll('.fu,.reveal,.reveal-left,.reveal-right,.reveal-scale')
          .forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
        if (loader) loader.style.display = 'none';
      }
    }, 3000);
  }

  // If reduced motion, skip all animations
  if (prefersReducedMotion) {
    document.querySelectorAll('.fu,.reveal,.reveal-left,.reveal-right,.reveal-scale')
      .forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
    if (loader) loader.style.display = 'none';
  }
});
```

---

## Phase 7 — Micro-Interaction Polish

### Goal
Small details that elevate the whole experience.

### Instructions

1. **Magnetic buttons** — Make `.btn`, `.cta-btn`, and `.nav-cta` subtly follow the cursor:

```js
if (innerWidth > 768 && !prefersReducedMotion) {
  document.querySelectorAll('.btn, .cta-btn, .nav-cta').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      gsap.to(btn, {
        x: x * 0.15,
        y: y * 0.15,
        duration: 0.3,
        ease: 'power2.out',
      });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    });
  });
}
```

2. **Hover glow on project cards** — Add a mouse-following radial glow inside each `.pc`:

**CSS**:
```css
.pc-glow{
  position:absolute;inset:0;z-index:0;pointer-events:none;
  opacity:0;transition:opacity .3s;
  border-radius:12px;overflow:hidden;
}
.pc:hover .pc-glow{opacity:1}
```

**JS**:
```js
document.querySelectorAll('.pc').forEach(pc => {
  const glow = document.createElement('div');
  glow.className = 'pc-glow';
  pc.style.position = 'relative';
  pc.insertBefore(glow, pc.firstChild);

  pc.addEventListener('mousemove', (e) => {
    const r = pc.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    glow.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(185,28,28,.06), transparent 40%)`;
  });
});
```

3. **Timeline dot pulse on scroll** — When each timeline row enters view, pulse its dot:

```js
document.querySelectorAll('.tl-row').forEach(row => {
  ScrollTrigger.create({
    trigger: row,
    start: 'top 80%',
    onEnter: () => {
      const dot = row.querySelector('.tl-dot');
      if (dot) {
        gsap.fromTo(dot,
          { scale: 0.5, backgroundColor: 'var(--bg4)' },
          {
            scale: 1, backgroundColor: 'var(--r)',
            duration: 0.5, ease: 'back.out(2.5)',
            onComplete: () => {
              gsap.to(dot, { backgroundColor: 'var(--bg4)', duration: 1.2, ease: 'power1.out' });
            }
          }
        );
      }
    },
    once: true,
  });
});
```

4. **CTA strip entrance** — Animate the dark CTA strip dramatically:

```js
gsap.fromTo('.cta-strip',
  { opacity: 0, y: 40, scale: 0.97 },
  {
    opacity: 1, y: 0, scale: 1,
    duration: 0.8, ease: 'power3.out',
    scrollTrigger: { trigger: '.cta-strip', start: 'top 85%' }
  }
);
```

5. **Stat counter upgrade** — When bento stat numbers animate in, add a brief scale bounce at the end using GSAP:

In the existing `animCount` function, after the counter finishes, add:
```js
gsap.fromTo(el, { scale: 1.15 }, { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.5)' });
```

---

## Phase 8 — Nav Shrink & Blur Transition

### Goal
Make the nav transition feel more premium with a GSAP-powered shrink.

### Instructions

1. **Replace** the existing nav scroll class toggle (item #6) with:

```js
ScrollTrigger.create({
  start: 20,
  onUpdate: (self) => {
    if (self.scroll() > 20) {
      navEl.classList.add('scrolled');
    } else {
      navEl.classList.remove('scrolled');
    }
  }
});
```

2. **Add smooth height transition** to nav CSS:
```css
nav { transition: background .4s, box-shadow .4s, padding .3s; }
nav.scrolled { box-shadow: 0 1px 12px rgba(0,0,0,.06); }
.nav-inner { transition: height .3s var(--spring); }
nav.scrolled .nav-inner { height: 50px; }
```

---

## Verification Checklist

After all phases, verify:

- [ ] Page loads with cinematic loader → hero entrance sequence
- [ ] Smooth scrolling via Lenis (buttery, not jerky)
- [ ] Section elements animate in via GSAP ScrollTrigger (not IntersectionObserver)
- [ ] Hero parallax layers move at different depths
- [ ] Project card images parallax on scroll
- [ ] Floating section indicator appears on left when scrolling past hero
- [ ] Buttons have magnetic hover effect
- [ ] Project cards have mouse-following glow
- [ ] Timeline dots pulse when entering viewport
- [ ] CTA strip animates in dramatically
- [ ] Nav smoothly shrinks on scroll
- [ ] All effects disabled for `prefers-reduced-motion`
- [ ] Mobile (≤768px): Lenis disabled, section indicator hidden, no magnetic effects
- [ ] No console errors
- [ ] The file is still a single valid HTML file
- [ ] All existing content, colors, and typography are unchanged
