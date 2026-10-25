// Điều hướng trên mobile (hamburger menu)
document.addEventListener('click', e => {
  const toggle = e.target.closest('.nav-toggle');
  if (!toggle) return;
  const nav = document.querySelector('#global-nav');
  if (!nav) return;
  const isOpen = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!isOpen));
  nav.classList.toggle('open', !isOpen);
});
