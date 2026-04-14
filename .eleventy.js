module.exports = function (eleventyConfig) {
    // Static files — copied from project root into _site/
    eleventyConfig.addPassthroughCopy({ "styles.css": "styles.css" });
    eleventyConfig.addPassthroughCopy({ "dark-mode.css": "dark-mode.css" });
    eleventyConfig.addPassthroughCopy({ "scripts.js": "scripts.js" });
    eleventyConfig.addPassthroughCopy({ "assets": "assets" });
    eleventyConfig.addPassthroughCopy({ "favicon": "favicon" });

    // Blog posts collection, newest first
    eleventyConfig.addCollection("posts", function (collectionApi) {
        return collectionApi.getFilteredByGlob("src/posts/*.md").reverse();
    });

    // Filters
    eleventyConfig.addFilter("readableDate", (dateObj) => {
        return new Date(dateObj).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            timeZone: "UTC",
        });
    });

    eleventyConfig.addFilter("htmlDate", (dateObj) => {
        return new Date(dateObj).toISOString().split("T")[0];
    });

    eleventyConfig.addFilter("limit", (arr, limit) => arr.slice(0, limit));

    return {
        dir: {
            input: "src",
            output: "_site",
            includes: "_includes",
            layouts: "_includes/layouts",
        },
        templateFormats: ["njk", "md", "html"],
        markdownTemplateEngine: "njk",
        htmlTemplateEngine: "njk",
    };
};
