const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.join(__dirname, '..');

function read(relativePath) {
    return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('post layout renders optional hero image metadata', () => {
    const layout = read(path.join('src', '_includes', 'layouts', 'post.njk'));

    assert.match(layout, /\{% if heroImage %\}/);
    assert.match(layout, /<figure class="post-hero-image">/);
    assert.match(layout, /src="\{\{ heroImage \}\}"/);
    assert.match(layout, /alt="\{\{ heroImageAlt \}\}"/);
    assert.match(layout, /\{% if heroImageCaption %\}/);
});

test('post styles support readable articles and post images', () => {
    const css = read('styles.css');

    assert.match(css, /\.post-article\s*\{/);
    assert.match(css, /\.post-meta\s*\{/);
    assert.match(css, /\.post-hero-image\s+img\s*\{/);
    assert.match(css, /\.post-body\s+img\s*\{/);
});

test('first blog post has publish metadata and imported media references', () => {
    const post = read(path.join('src', 'posts', 'tech-is-losing-young-americans.md'));

    assert.match(post, /^title: "tech is losing young americans\. how can they win them back\?"/m);
    assert.match(post, /^date: 2026-07-07$/m);
    assert.match(post, /^permalink: "\/blog\/tech-is-losing-young-americans\/"$/m);
    assert.match(post, /^heroImage: "\/assets\/blog\/tech-is-losing-young-americans\/threshold_header\.svg"$/m);
    assert.match(post, /<figure class="post-body-figure post-body-figure--narrow">/);
    assert.match(post, /<img src="\/assets\/blog\/tech-is-losing-young-americans\/waymovandalized\.jpg" alt="Graffiti-covered Waymo vehicle referenced in the post" loading="lazy" \/>/);
    assert.match(post, /<figcaption>Graffiti-covered Waymo shown in a TikTok about "Waymo revenge\." Source: @vivxianna on TikTok\.<\/figcaption>/);
    assert.doesNotMatch(post, /!\[Graffiti-covered Waymo vehicle referenced in the post\]/);
    assert.doesNotMatch(post, /\[insert screenshot of the tiktok\]/i);
});

test('first blog post media assets are copied into the passthrough assets tree', () => {
    assert.ok(fs.existsSync(path.join(repoRoot, 'assets', 'blog', 'tech-is-losing-young-americans', 'threshold_header.svg')));
    assert.ok(fs.existsSync(path.join(repoRoot, 'assets', 'blog', 'tech-is-losing-young-americans', 'waymovandalized.jpg')));
});

test('built site publishes the first post and surfaces it from blog entry points', () => {
    const postHtml = read(path.join('_site', 'blog', 'tech-is-losing-young-americans', 'index.html'));
    const blogHtml = read(path.join('_site', 'blog', 'index.html'));
    const homeHtml = read(path.join('_site', 'index.html'));

    assert.match(postHtml, /tech is losing young americans\. how can they win them back\?/);
    assert.match(postHtml, /\/assets\/blog\/tech-is-losing-young-americans\/threshold_header\.svg/);
    assert.match(postHtml, /\/assets\/blog\/tech-is-losing-young-americans\/waymovandalized\.jpg/);
    assert.match(postHtml, /class="post-body-figure post-body-figure--narrow"/);
    assert.match(postHtml, /Graffiti-covered Waymo shown in a TikTok about "Waymo revenge\." Source: @vivxianna on TikTok\./);
    assert.match(blogHtml, /\/blog\/tech-is-losing-young-americans\//);
    assert.match(homeHtml, /\/blog\/tech-is-losing-young-americans\//);
});

test('blog index uses editorial list entries instead of generic cards', () => {
    const blogTemplate = read(path.join('src', 'blog.njk'));
    const css = read('styles.css');

    assert.match(blogTemplate, /class="blog-list"/);
    assert.match(blogTemplate, /class="blog-list-item"/);
    assert.doesNotMatch(blogTemplate, /class="card blog-post-card"/);
    assert.match(css, /\.blog-list-item\s*\{[^}]*border-left:\s*4px solid #ea0213;/s);
    assert.match(css, /\.blog-list-item time\s*\{/);
});

test('homepage blog peek uses image cards with post hero art', () => {
    const homeTemplate = read(path.join('src', 'index.njk'));
    const css = read('styles.css');

    assert.match(homeTemplate, /class="blog-peek-grid"/);
    assert.match(homeTemplate, /class="blog-peek-card"/);
    assert.match(homeTemplate, /src="\{\{ post\.data\.heroImage \}\}"/);
    assert.match(homeTemplate, /class="blog-peek-card-media"/);
    assert.match(css, /\.blog-peek-card-media\s+img\s*\{/);
    assert.match(css, /\.blog-peek-card\s+time\s*\{/);
});

test('post editorial styles constrain the reading column and body figure', () => {
    const css = read('styles.css');

    assert.match(css, /\.post-article\s*\{[^}]*max-width:\s*680px;/s);
    assert.match(css, /\.post-hero-image\s*\{[^}]*max-width:\s*760px;/s);
    assert.match(css, /\.post-body\s*\{[^}]*font-size:\s*1\.08rem;[^}]*line-height:\s*1\.78;/s);
    assert.match(css, /\.post-body\s*>\s*\*\s*\+\s*\*\s*\{[^}]*margin-top:\s*1\.25em;/s);
    assert.match(css, /\.post-body h2\s*\{[^}]*font-size:\s*1\.65rem;[^}]*line-height:\s*1\.22;[^}]*margin-top:\s*2\.2em;/s);
    assert.match(css, /\.post-body-figure--narrow\s*\{[^}]*width:\s*70%;/s);
    assert.match(css, /@media \(max-width:\s*768px\)[\s\S]*\.post-body-figure--narrow\s*\{[^}]*width:\s*100%;/s);
});
