(() => {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const links = [...document.querySelectorAll('.top-nav a[href^="#"]')];
  const sections = links.map(link => document.getElementById(link.hash.slice(1)));
  const header = document.querySelector('.site-header');
  let scheduled = false;
  const updateCurrentSection = () => {
    scheduled = false;
    const headerHeight = header?.getBoundingClientRect().height || 0;
    document.documentElement.style.setProperty('--nav-height', `${headerHeight}px`);
    const readingLine = headerHeight + 40;
    let current = 0;
    sections.forEach((section, index) => {
      if (section && section.getBoundingClientRect().top <= readingLine) current = index;
    });
    if (window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) current = sections.length - 1;
    links.forEach((link, index) => {
      if (index === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };
  const scheduleUpdate = () => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(updateCurrentSection);
  };
  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate);
  window.addEventListener('pageshow', scheduleUpdate);
  document.fonts?.ready.then(scheduleUpdate);
  if (header && 'ResizeObserver' in window) new ResizeObserver(scheduleUpdate).observe(header);
  updateCurrentSection();

  if (preference.matches || !('IntersectionObserver' in window)) return;

  const headings = document.querySelectorAll('.section > h2');
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.remove('stroke-pending');
      entry.target.classList.add('stroke-drawn');
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.8 });

  for (const heading of headings) {
    heading.classList.add('stroke-pending');
    observer.observe(heading);
  }

  // A live accessibility preference change stops all remaining entrance effects.
  preference.addEventListener('change', (event) => {
    if (!event.matches) return;
    observer.disconnect();
    for (const heading of headings) {
      heading.classList.remove('stroke-pending', 'stroke-drawn');
    }
  });
})();
