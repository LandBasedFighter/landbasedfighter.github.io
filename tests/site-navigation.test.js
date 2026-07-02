const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

test('home navigation targets the page root instead of the home section anchor', () => {
    const layout = fs.readFileSync(path.join(__dirname, '..', 'src', '_includes', 'layouts', 'base.njk'), 'utf8');
    const staticHome = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

    assert.match(layout, /<li><a href="\/">home<\/a><\/li>/);
    assert.doesNotMatch(layout, /href="\/#home"/);
    assert.doesNotMatch(staticHome, /href="#home"/);
});

test('homepage serves responsive optimized hero images', () => {
    const homepage = fs.readFileSync(path.join(__dirname, '..', 'src', 'index.njk'), 'utf8');
    const staticHome = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

    [homepage, staticHome].forEach((content) => {
        assert.match(content, /<picture class="hero-picture">/);
        assert.match(content, /srcset="[^"]*morgan-hero-320\.jpg\s+320w,[^"]*morgan-hero-480\.jpg\s+480w,[^"]*morgan-hero-800\.jpg\s+800w"/s);
        assert.match(content, /sizes="\([^"]*max-width:\s*768px[^"]*\)\s*68vw,\s*400px"/);
        assert.match(content, /src="[^"]*morgan-hero-800\.jpg"/);
        assert.match(content, /width="800"/);
        assert.match(content, /height="1067"/);
        assert.match(content, /decoding="async"/);
        assert.match(content, /fetchpriority="high"/);
        assert.doesNotMatch(content, /src="[^"]*morgan-hero\.jpg"/);
    });

    [
        ['morgan-hero-320.jpg', 45 * 1024],
        ['morgan-hero-480.jpg', 75 * 1024],
        ['morgan-hero-800.jpg', 150 * 1024],
    ].forEach(([fileName, maxBytes]) => {
        const assetPath = path.join(__dirname, '..', 'assets', fileName);
        assert.equal(fs.existsSync(assetPath), true, `${fileName} should exist`);
        assert.ok(fs.statSync(assetPath).size < maxBytes, `${fileName} should stay optimized`);
    });
});
