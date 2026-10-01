(() => {
  const viewer = document.createElement('dialog');
  if (typeof viewer.showModal !== 'function') return;

  viewer.className = 'project-image-viewer';
  viewer.innerHTML = `
    <button class="project-image-viewer-close" type="button" aria-label="Close image and return to homepage" autofocus>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m6 6 12 12M18 6 6 18" />
      </svg>
    </button>
    <img alt="">
  `;
  document.body.append(viewer);
  const image = viewer.querySelector('img');
  let trigger;
  let previousOverflow;

  document.querySelectorAll('#research a[href]').forEach(link => {
    if (!/\.(png|jpe?g|webp|gif|svg)(?:[?#]|$)/i.test(link.href)) return;
    link.setAttribute('aria-haspopup', 'dialog');
    link.addEventListener('click', event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      trigger = link;
      const thumbnail = link.querySelector('img') || link.closest('article')?.querySelector('.figure-link img');
      image.alt = thumbnail?.alt || 'Project figure';
      image.src = link.href;
      viewer.setAttribute('aria-label', `${image.alt} — enlarged image`);
      previousOverflow = document.documentElement.style.overflow;
      document.documentElement.style.overflow = 'hidden';
      viewer.showModal();
    });
  });

  viewer.querySelector('button').addEventListener('click', () => viewer.close());
  viewer.addEventListener('click', event => {
    if (event.target === viewer) viewer.close();
  });
  // Native dialog handles Escape and keeps keyboard focus inside the viewer.
  viewer.addEventListener('close', () => {
    document.documentElement.style.overflow = previousOverflow;
    image.removeAttribute('src');
    trigger?.focus({ preventScroll: true });
  });
})();
