// Enable JS-powered animations (keeps content visible if JS fails)
document.body.classList.add('js-animations');

// Dark mode toggle
const darkModeToggle = document.getElementById('dark-mode-toggle');
const html = document.documentElement;

function applyTheme(isDark) {
    html.classList.toggle('dark-mode', isDark);
    darkModeToggle.checked = isDark;
}

// check for saved dark mode preference or system preference
const savedDarkMode = localStorage.getItem('darkMode');
const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedDarkMode !== null) {
    applyTheme(savedDarkMode === 'true');
} else {
    applyTheme(false);
}

darkModeToggle.addEventListener('change', () => {
    const isDarkMode = darkModeToggle.checked;
    localStorage.setItem('darkMode', isDarkMode);
    applyTheme(isDarkMode);
});

// Listen for system preference changes
const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
darkModeQuery.addEventListener('change', (e) => {
    // Only apply system preference if user hasn't manually set a preference
    if (localStorage.getItem('darkMode') === null) {
        applyTheme(e.matches);
    }
});

// Intersection Observer for scroll animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1,
});

document.querySelectorAll('section').forEach((section) => {
    observer.observe(section);
});

// Dynamic copyright year
document.querySelectorAll('.footer-copy').forEach((el) => {
    el.textContent = `© ${new Date().getFullYear()} Morgan Guinyard`;
});

// Hamburger menu toggle
const hamburgerBtn = document.getElementById('hamburger-btn');
const topBarLinks = document.getElementById('top-bar-links');

if (hamburgerBtn && topBarLinks) {
    hamburgerBtn.addEventListener('click', () => {
        const isOpen = topBarLinks.classList.toggle('open');
        hamburgerBtn.classList.toggle('open', isOpen);
        hamburgerBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when a nav link is clicked
    topBarLinks.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            topBarLinks.classList.remove('open');
            hamburgerBtn.classList.remove('open');
            hamburgerBtn.setAttribute('aria-expanded', false);
        });
    });
}
