(() => {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
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
