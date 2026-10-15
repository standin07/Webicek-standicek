const root = document.documentElement;
const themeButton = document.querySelector('.theme-toggle');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');
const themeIcon = themeButton.querySelector('.theme-icon');

try {
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme === 'dark' || savedTheme === 'light') {
    root.dataset.theme = savedTheme;
  }
} catch {
  // The site remains usable when browser storage is unavailable.
}

function updateThemeControl() {
  const isDark = root.dataset.theme === 'dark';
  const nextTheme = isDark ? 'light' : 'dark';
  const label = nextTheme === 'dark' ? 'Přepnout na tmavý motiv' : 'Přepnout na světlý motiv';
  themeButton.setAttribute('aria-label', label);
  themeButton.setAttribute('title', label);
  themeButton.setAttribute('aria-pressed', String(isDark));
  themeIcon.textContent = isDark ? '☀' : '☾';
}

updateThemeControl();

themeButton.addEventListener('click', () => {
  const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = nextTheme;
  updateThemeControl();
  try {
    localStorage.setItem('portfolio-theme', nextTheme);
  } catch {
    // Theme switching still works for the current page view.
  }
});

const filterButtons = document.querySelectorAll('.filter-button');
const filterTargets = document.querySelectorAll('.skill-group[data-tags], .project-item[data-tags]');
const filterStatus = document.querySelector('.filter-status');
const filterMessages = {
  all: 'Zobrazují se všechny dovednosti a projekty.',
  siemens: 'Zvýrazněny dovednosti a projekty spojené se Siemens.',
  arduino: 'Zvýrazněny dovednosti spojené s Arduinem.',
  scouting: 'Zvýrazněny skautské projekty.'
};

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const selectedFilter = button.dataset.filter;

    filterButtons.forEach((item) => {
      const isSelected = item === button;
      item.classList.toggle('is-active', isSelected);
      item.setAttribute('aria-pressed', String(isSelected));
    });

    filterTargets.forEach((item) => {
      const matches = selectedFilter === 'all' || item.dataset.tags.split(/\s+/).includes(selectedFilter);
      item.classList.toggle('is-highlighted', selectedFilter !== 'all' && matches);
      item.classList.toggle('is-dimmed', selectedFilter !== 'all' && !matches);
    });

    filterStatus.textContent = filterMessages[selectedFilter] || filterMessages.all;
  });
});

const revealTargets = document.querySelectorAll('.section-content, .section-index, .skill-group, .project-item');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });

  revealTargets.forEach((target) => {
    target.classList.add('reveal');
    revealObserver.observe(target);
  });
} else {
  revealTargets.forEach((target) => target.classList.add('is-visible'));
}

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  navigation.classList.toggle('is-open', !isOpen);
});

navigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) {
    menuButton.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
  }
});

document.querySelector('#year').textContent = new Date().getFullYear();
