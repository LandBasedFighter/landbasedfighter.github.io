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
