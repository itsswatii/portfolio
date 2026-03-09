function setupReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return null;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('on');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealEls.forEach(el => {
    if (!el.classList.contains('on')) {
      obs.observe(el);
    }
  });

  return obs;
}

function reobserveReveals(observer) {
  if (!observer) return;
  document.querySelectorAll('.reveal').forEach(el => {
    if (!el.classList.contains('on')) {
      observer.observe(el);
    }
  });
}

function setupWorkPage(observer) {
  const projectsPanel = document.getElementById('projects-panel');
  const blogPanel = document.getElementById('blog-panel');
  const tabButtons = document.querySelectorAll('.tab-btn');
  const filterChips = document.querySelectorAll('.filter-chip');
  const projectCards = document.querySelectorAll('.proj-card');

  if (!projectsPanel || !blogPanel || !tabButtons.length) return;

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = btn.dataset.panel;

      projectsPanel.style.display = panel === 'projects' ? 'block' : 'none';
      blogPanel.style.display = panel === 'blog' ? 'block' : 'none';

      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (panel === 'blog') {
        window.location.hash = 'blog';
      } else if (window.location.hash === '#blog') {
        history.replaceState(null, '', window.location.pathname);
      }

      reobserveReveals(observer);
    });
  });

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const category = chip.dataset.filter;

      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      projectCards.forEach(card => {
        const cats = card.dataset.cat || '';
        const show = category === 'all' || cats.includes(category);
        card.style.display = show ? 'flex' : 'none';
        if (show) card.style.flexDirection = 'column';
      });
    });
  });

  if (window.location.hash === '#blog') {
    const blogTab = document.getElementById('blog-tab');
    if (blogTab) blogTab.click();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const observer = setupReveal();
  setupWorkPage(observer);
});