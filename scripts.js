// Dark mode toggle
const darkModeToggle = document.getElementById('dark-mode-toggle');
const html = document.documentElement;
const siteHeaderLogo = document.querySelector('.siteheader-logo');

const lightLogoSrc = 'assets/Header SVG Light.svg';
const darkLogoSrc = 'assets/Header PNG Dark.png'; //canva subscription ran out lol 

function applyTheme(isDark) {
    html.classList.toggle('dark-mode', isDark);
    darkModeToggle.checked = isDark;
    if (siteHeaderLogo) {
        siteHeaderLogo.src = isDark ? darkLogoSrc : lightLogoSrc;
    }
}

// check for saved dark mode preference or system preference
const savedDarkMode = localStorage.getItem('darkMode');
const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedDarkMode !== null) {
    applyTheme(savedDarkMode === 'true');
} else {
    applyTheme(prefersDarkMode);
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
