const sections = document.querySelectorAll('section');
const revealItems = document.querySelectorAll('section, .card');

if ('IntersectionObserver' in window) {
    document.body.classList.add('motion-ready');

    const observer = new window.IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -8% 0px',
    });

    revealItems.forEach((item) => {
        item.classList.add('reveal-item');
        observer.observe(item);
    });
} else {
    sections.forEach((section) => {
        section.classList.add('visible');
    });
}

document.querySelectorAll('.footer-copy').forEach((el) => {
    el.textContent = `© ${new Date().getFullYear()} morgan guinyard`;
});

document.querySelectorAll('a[href="/"]').forEach((link) => {
    link.addEventListener('click', (event) => {
        if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
            return;
        }

        event.preventDefault();
        window.history.pushState(null, '', '/');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

document.querySelectorAll('a[href]').forEach((link) => {
    link.addEventListener('click', (event) => {
        if (
            event.defaultPrevented ||
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey ||
            link.target
        ) {
            return;
        }

        const href = link.getAttribute('href') || '';
        if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
            return;
        }

        const destination = new URL(href, window.location.href);
        const isBlogDestination = destination.pathname === '/blog/';
        if (
            destination.origin !== window.location.origin ||
            destination.href === window.location.href ||
            !isBlogDestination
        ) {
            return;
        }

        event.preventDefault();
        document.body.classList.add('page-is-leaving');
        window.setTimeout(() => {
            window.location.href = destination.href;
        }, 120);
    });
});

window.addEventListener('pageshow', () => {
    document.body.classList.remove('page-is-leaving');
});

const topBar = document.querySelector('.top-bar-container');
const navLinks = document.querySelectorAll('.top-bar-links a');

function normalizeSectionHref(href) {
    const hashIndex = href.indexOf('#');
    return hashIndex >= 0 ? href.slice(hashIndex + 1) : '';
}

function setActiveNav(sectionId) {
    navLinks.forEach((link) => {
        const linkSectionId = normalizeSectionHref(link.getAttribute('href') || '');
        link.classList.toggle('is-active', linkSectionId === sectionId);
    });
}

function updateHeaderScrollState() {
    if (!topBar) return;
    topBar.classList.toggle('has-scrolled', window.scrollY > 8);
}

document.addEventListener('scroll', updateHeaderScrollState, { passive: true });
updateHeaderScrollState();

if ('IntersectionObserver' in window) {
    const navObserver = new window.IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting && entry.target.id) {
                setActiveNav(entry.target.id);
            }
        });
    }, {
        threshold: 0.35,
        rootMargin: '-20% 0px -55% 0px',
    });

    sections.forEach((section) => {
        navObserver.observe(section);
    });
}

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
