const sections = document.querySelectorAll('section');

if ('IntersectionObserver' in window) {
    document.body.classList.add('js-animations');

    const observer = new window.IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
    });

    sections.forEach((section) => {
        observer.observe(section);
    });
} else {
    sections.forEach((section) => {
        section.classList.add('visible');
    });
}

document.querySelectorAll('.footer-copy').forEach((el) => {
    el.textContent = `© ${new Date().getFullYear()} morgan guinyard`;
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
