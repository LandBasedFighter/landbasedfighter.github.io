document.body.classList.add('js-animations');

const darkModeToggle = document.getElementById('dark-mode-toggle');
const html = document.documentElement;

function applyTheme(isDark) {
    html.classList.toggle('dark-mode', isDark);
    darkModeToggle.checked = isDark;
}

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

const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
darkModeQuery.addEventListener('change', (e) => {
    if (localStorage.getItem('darkMode') === null) {
        applyTheme(e.matches);
    }
});

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

document.querySelectorAll('.footer-copy').forEach((el) => {
    el.textContent = `© ${new Date().getFullYear()} Morgan Guinyard`;
});

(function () {
    const KONAMI = [
        'ArrowUp','ArrowUp',
        'ArrowDown','ArrowDown',
        'ArrowLeft','ArrowRight',
        'ArrowLeft','ArrowRight',
        'b','a'
    ];
    let progress = 0;

    const heroImg = document.querySelector('.hero-image img');
    const heroH1  = document.querySelector('.hero-text h1');
    const heroH2  = document.querySelector('.hero-text h2');
    const heroH3  = document.querySelector('.hero-text h3');

    function activateLuna() {
        if (!heroImg || !heroH1 || !heroH2) return;

        heroImg.src = '/assets/luna.jpg.jpeg';
        heroImg.alt = 'Luna the cat, future overlord.';
        heroH1.textContent = "hi! i'm luna";
        heroH2.textContent = 'cat / feline / future overlord';

        if (heroH3) {
            heroH3.innerHTML = '<i>(refresh to go back to normal)</i>';
        }

        const meow = new Audio('/assets/meow.mp3');
        meow.play().catch(() => {});
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === KONAMI[progress]) {
            progress++;
            if (progress === KONAMI.length) {
                progress = 0;
                activateLuna();
            }
        } else {
            progress = e.key === KONAMI[0] ? 1 : 0;
        }
    });
})();

const hamburgerBtn = document.getElementById('hamburger-btn');
const topBarLinks = document.getElementById('top-bar-links');

if (hamburgerBtn && topBarLinks) {
    hamburgerBtn.addEventListener('click', () => {
        const isOpen = topBarLinks.classList.toggle('open');
        hamburgerBtn.classList.toggle('open', isOpen);
        hamburgerBtn.setAttribute('aria-expanded', isOpen);
    });

    topBarLinks.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            topBarLinks.classList.remove('open');
            hamburgerBtn.classList.remove('open');
            hamburgerBtn.setAttribute('aria-expanded', false);
        });
    });
}
