(() => {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const links = [...document.querySelectorAll('.top-nav a[href^="#"]')];
  const sections = links.map(link => document.getElementById(link.hash.slice(1)));
  const navigation = document.querySelector('.top-nav');
  const navigationSlot = document.querySelector('.nav-slot');
  let scheduled = false;
  const updateCurrentSection = () => {
    scheduled = false;
    navigation?.classList.toggle('is-docked', navigationSlot?.getBoundingClientRect().top <= 12);
    const readingLine = Math.min(160, window.innerHeight * 0.25);
    let current = -1;
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
