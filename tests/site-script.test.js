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
    const sections = [{ classList: createClassList() }, { classList: createClassList() }];
    const footerCopy = { textContent: '' };
    const homeLinks = [
        { addEventListener: (eventName, handler) => { homeLinks[0][eventName] = handler; } },
        { addEventListener: (eventName, handler) => { homeLinks[1][eventName] = handler; } },
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

            if (selector === '.footer-copy') {
                return [footerCopy];
            }

            if (selector === 'a[href="/"]') {
                return homeLinks;
            }

            return [];
        },
    };

    const context = {
        document,
        window: {
            location: { pathname: '/' },
            history: { pushState: () => {} },
        },
        ...contextOverrides,
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
