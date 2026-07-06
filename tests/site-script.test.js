const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

function createClassList() {
    const classes = new Set();
    return {
        add: (...names) => names.forEach((name) => classes.add(name)),
        remove: (...names) => names.forEach((name) => classes.delete(name)),
        toggle: (name, force) => {
            const shouldAdd = force ?? !classes.has(name);
            if (shouldAdd) {
                classes.add(name);
            } else {
                classes.delete(name);
            }
            return shouldAdd;
        },
        contains: (name) => classes.has(name),
    };
}

function runSiteScript(contextOverrides = {}) {
    const script = fs.readFileSync(path.join(__dirname, '..', 'scripts.js'), 'utf8');
    const heroSection = { id: 'home', classList: createClassList() };
    heroSection.classList.add('train-hero');
    const sections = [heroSection, { id: 'about', classList: createClassList() }];
    const card = { classList: createClassList() };
    const footerCopy = { textContent: '' };
    const createLink = (href) => {
        const listeners = {};
        return {
            target: '',
            addEventListener: (eventName, handler) => {
                listeners[eventName] = listeners[eventName] || [];
                listeners[eventName].push(handler);
            },
            getAttribute: (name) => (name === 'href' ? href : ''),
            click: (event = {}) => {
                (listeners.click || []).forEach((handler) => handler({
                    button: 0,
                    metaKey: false,
                    ctrlKey: false,
                    shiftKey: false,
                    altKey: false,
                    defaultPrevented: false,
                    ...event,
                }));
            },
        };
    };
    const homeLinks = [
        createLink('/'),
        createLink('/'),
    ];
    const bodyClassList = createClassList();

    const document = {
        body: { classList: bodyClassList },
        addEventListener: () => {},
        getElementById: () => null,
        querySelector: () => null,
        querySelectorAll: (selector) => {
            if (selector === 'section') {
                return sections;
            }

            if (selector === 'section, .card') {
                return [...sections, card];
            }

            if (selector === 'section:not(.train-hero), .card') {
                return [sections[1], card];
            }

            if (selector === '.footer-copy') {
                return [footerCopy];
            }

            if (selector === 'a[href="/"]') {
                return homeLinks;
            }

            if (selector === 'a[href]') {
                return homeLinks;
            }

            return [];
        },
    };

    const baseLocation = {
        href: 'https://morganguinyard.com/',
        origin: 'https://morganguinyard.com',
        pathname: '/',
        hash: '',
    };

    const baseWindow = {
        location: baseLocation,
        history: { pushState: () => {} },
        addEventListener: () => {},
        setTimeout: (handler) => handler(),
    };

    const context = {
        document,
        URL,
        ...contextOverrides,
        window: {
            ...baseWindow,
            ...(contextOverrides.window || {}),
            location: {
                ...baseLocation,
                ...((contextOverrides.window || {}).location || {}),
            },
        },
    };

    vm.runInNewContext(script, context);

    return { bodyClassList, footerCopy, homeLinks, sections };
}

test('keeps page sections visible when IntersectionObserver is unavailable', () => {
    const { bodyClassList, sections } = runSiteScript();

    assert.equal(bodyClassList.contains('js-animations'), false);
    assert.ok(sections.every((section) => section.classList.contains('visible')));
});

test('does not depend on JavaScript to make page sections visible', () => {
    const css = fs.readFileSync(path.join(__dirname, '..', 'styles.css'), 'utf8');

    assert.doesNotMatch(css, /\.js-animations\s+section\s*\{[^}]*opacity:\s*0\b/s);
});

test('keeps the homepage hero out of scroll reveal animations', () => {
    const observerInstances = [];

    function IntersectionObserver() {
        const observedItems = [];
        const instance = {
            observedItems,
            observe: (item) => {
                observedItems.push(item);
            },
        };
        observerInstances.push(instance);
        return instance;
    }

    const { sections } = runSiteScript({
        window: { IntersectionObserver },
    });

    assert.equal(sections[0].classList.contains('reveal-item'), false);
    assert.equal(observerInstances[0].observedItems.includes(sections[0]), false);
});

test('renders footer name in lowercase', () => {
    const { footerCopy } = runSiteScript();

    assert.match(footerCopy.textContent, /^© \d{4} morgan guinyard$/);
});

test('smooth-scrolls to top when home is clicked on the current page', () => {
    let preventedDefault = false;
    let scrollOptions;
    let pushedUrl;
    const { homeLinks } = runSiteScript({
        window: {
            location: { pathname: '/', hash: '#about' },
            scrollTo: (options) => { scrollOptions = options; },
            history: { pushState: (_state, _title, url) => { pushedUrl = url; } },
        },
    });

    homeLinks[0].click({ preventDefault: () => { preventedDefault = true; } });

    assert.equal(preventedDefault, true);
    assert.equal(scrollOptions.top, 0);
    assert.equal(scrollOptions.behavior, 'smooth');
    assert.equal(pushedUrl, '/');
});
