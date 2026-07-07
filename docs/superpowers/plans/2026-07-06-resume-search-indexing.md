# Resume Search Indexing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep the resume PDF downloadable from the site while discouraging search engines from crawling or indexing it.

**Architecture:** The static site is built by Eleventy. `src/robots.njk` generates `/robots.txt`, and `src/index.njk` generates the homepage resume link. The fix adds crawler directives at both surfaces: robots blocks the PDF path, and the homepage link uses `nofollow` while preserving the existing safe external-link attributes.

**Tech Stack:** Eleventy, Nunjucks, Node.js built-in test runner, static GitHub Pages hosting.

## Global Constraints

- Do not remove `assets/morgan-guinyard-resume.pdf`; the direct link must remain usable.
- Do not rely on custom HTTP headers; GitHub Pages does not support per-file `X-Robots-Tag` headers here.
- Keep the existing homepage resume link text and target behavior.
- Validate with `node --test tests\*.test.js` and `npm run build`.

---

### Task 1: Add Resume Crawler Controls

**Files:**
- Modify: `src/robots.njk`
- Modify: `src/index.njk`
- Test: `tests/site-navigation.test.js`

**Interfaces:**
- Consumes: existing Eleventy templates for `/robots.txt` and the homepage.
- Produces: `/robots.txt` containing `Disallow: /assets/morgan-guinyard-resume.pdf`; homepage resume anchor containing `rel="nofollow noopener noreferrer"`.

- [ ] **Step 1: Write the failing tests**

Add these tests to `tests/site-navigation.test.js`:

```js
test('robots.txt discourages crawlers from fetching the resume PDF', () => {
    const robots = fs.readFileSync(path.join(__dirname, '..', 'src', 'robots.njk'), 'utf8');

    assert.match(robots, /User-agent:\s*\*/);
    assert.match(robots, /Disallow:\s*\/assets\/morgan-guinyard-resume\.pdf/);
});

test('homepage resume link discourages crawler discovery while staying accessible', () => {
    const homepage = fs.readFileSync(path.join(__dirname, '..', 'src', 'index.njk'), 'utf8');

    assert.match(homepage, /href="\/assets\/morgan-guinyard-resume\.pdf"/);
    assert.match(homepage, /rel="nofollow noopener noreferrer"/);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test tests\site-navigation.test.js`

Expected: FAIL because `src/robots.njk` does not contain the resume `Disallow` rule and `src/index.njk` still uses `rel="noopener noreferrer"`.

- [ ] **Step 3: Add the robots rule**

Change `src/robots.njk` to:

```txt
---
permalink: /robots.txt
eleventyExcludeFromCollections: true
---
User-agent: *
Disallow: /assets/morgan-guinyard-resume.pdf
Allow: /

Sitemap: https://landbasedfighter.github.io/sitemap.xml
```

- [ ] **Step 4: Add `nofollow` to the homepage resume link**

In `src/index.njk`, change the resume anchor attributes to:

```html
<a
    href="/assets/morgan-guinyard-resume.pdf"
    target="_blank"
    rel="nofollow noopener noreferrer"
>
    here
</a>
```

- [ ] **Step 5: Run the targeted tests**

Run: `node --test tests\site-navigation.test.js`

Expected: PASS with the new robots and link tests included.

- [ ] **Step 6: Run full verification**

Run: `node --test tests\*.test.js`

Expected: PASS for all site tests.

Run: `npm run build`

Expected: Eleventy writes `_site/robots.txt` and `_site/index.html` successfully.

- [ ] **Step 7: Commit**

```bash
git add src/robots.njk src/index.njk tests/site-navigation.test.js docs/superpowers/plans/2026-07-06-resume-search-indexing.md
git commit -m "Discourage resume indexing" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```
