// Dark mode toggle
const darkModeToggle = document.getElementById('dark-mode-toggle');
const html = document.documentElement;

// Check for saved dark mode preference or system preference
const savedDarkMode = localStorage.getItem('darkMode');
const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedDarkMode === 'true' || (savedDarkMode === null && prefersDarkMode)) {
    html.classList.add('dark-mode');
    darkModeToggle.checked = true;
}

darkModeToggle.addEventListener('change', () => {
    html.classList.toggle('dark-mode');
    const isDarkMode = html.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
});

// Listen for system preference changes
const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
darkModeQuery.addEventListener('change', (e) => {
    // Only apply system preference if user hasn't manually set a preference
    if (localStorage.getItem('darkMode') === null) {
        if (e.matches) {
            html.classList.add('dark-mode');
            darkModeToggle.checked = true;
        } else {
            html.classList.remove('dark-mode');
            darkModeToggle.checked = false;
        }
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

