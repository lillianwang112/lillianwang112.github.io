(() => {
  const bar = document.querySelector('.marquee-wrap');
  const toggle = bar?.querySelector('.marquee-toggle');
  if (!toggle) return;
  toggle.addEventListener('click', () => {
    const paused = bar.classList.toggle('is-paused');
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.setAttribute('aria-label', `${paused ? 'Play' : 'Pause'} scrolling bar and Pikachu`);
    toggle.textContent = paused ? 'Play' : 'Pause';
  });
})();
