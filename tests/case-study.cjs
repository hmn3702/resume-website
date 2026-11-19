const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { test } = require('node:test');

function load(file) {
  const filename = path.resolve(file);
  const m = new Module(filename, module);
  m.filename = filename;
  m.paths = Module._nodeModulePaths(path.dirname(filename));
  m._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  }).outputText, filename);
  return m.exports;
}

const { slugify, hasCaseStudy } = load('lib/case-study.ts');
const RichText = load('components/projects/RichText.tsx').default;
const render = (text) => renderToStaticMarkup(React.createElement(RichText, { text }));

test('slugify makes URL-safe slugs, including Vietnamese titles', () => {
  assert.equal(slugify('Coffee Shop Sales – Power BI'), 'coffee-shop-sales-power-bi');
  assert.equal(slugify('  Giá thuê nhà theo Suburb (Brisbane) '), 'gia-thue-nha-theo-suburb-brisbane');
  assert.equal(slugify('Đường đua'), 'duong-dua');
  assert.equal(slugify('!!!'), '');
  assert.ok(slugify('x'.repeat(200)).length <= 80);
});

test('hasCaseStudy ignores whitespace-only sections', () => {
  assert.equal(hasCaseStudy({ problem: '   ', data: null }), false);
  assert.equal(hasCaseStudy({ insights: 'Revenue peaks at 10am' }), true);
});

test('RichText: paragraphs, bullets and line breaks', () => {
  const html = render('First paragraph\nsame paragraph\n\n- one\n- two\n\nAfter list');
  assert.equal((html.match(/<p>/g) || []).length, 2);
  assert.equal((html.match(/<li>/g) || []).length, 2);
  assert.match(html, /First paragraph<br\/>same paragraph/);
});

test('RichText escapes HTML instead of rendering it', () => {
  const html = render('<script>alert(1)</script>\n- <img src=x onerror=alert(1)>');
  assert.doesNotMatch(html, /<script>|<img/);
  assert.match(html, /&lt;script&gt;/);
});
