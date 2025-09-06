const MarkdownIt = require('markdown-it');
const md = new MarkdownIt({ html: true, breaks: true });

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ 'src/assets': 'assets' });
  eleventyConfig.addGlobalData('year', new Date().getFullYear());

  eleventyConfig.addFilter('md', s => md.render(s || ''));

  eleventyConfig.addCollection('navPages', (api) => {
    return api.getAll()
      .filter((item) =>
        item.url &&
        item.url !== '/' &&
        item.url.split('/').filter(Boolean).length === 1 && // top-level like /peering/
        !item.data.excludeFromNav
      )
      .sort((a, b) =>
        (a.data.nav_order ?? 999) - (b.data.nav_order ?? 999) ||
        (a.data.title || a.fileSlug).localeCompare(b.data.title || b.fileSlug)
      );
  });

  return {
    dir: { input: 'src', includes: 'layouts', data: '_data', output: '_site' },
    pathPrefix: process.env.PATH_PREFIX || '/',
    templateFormats: ['njk', 'md', 'html'],
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk'
  };
};
