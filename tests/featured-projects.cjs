const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { test } = require('node:test');

Module._extensions['.tsx'] = (loaded, file) => {
  loaded._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  }).outputText, file);
};

const filename = path.resolve('components/home/FeaturedProjects.tsx');
const component = new Module(filename, module);
component.filename = filename;
component.paths = Module._nodeModulePaths(path.dirname(filename));
component._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, esModuleInterop: true },
}).outputText, filename);
const FeaturedProjects = component.exports.default;

test('projects without images have themed covers beside projects with images', () => {
  const project = { id: 'one', title: 'A_LONG_PROJECT_TITLE_WITHOUT_SPACES', description: 'Project description', tech_stack: [], github_url: 'https://github.com/example/project', live_url: null, image_url: null };
  const html = renderToStaticMarkup(React.createElement(FeaturedProjects, {
    projects: [{ ...project, id: 'two', image_url: '/preview.png' }, project],
  }));
  assert.doesNotMatch(html, /No image available/);
  const imagelessCard = html.match(/<article[^>]*>[\s\S]*?<\/article>/g)[1];
  assert.match(imagelessCard, /Software &amp; Web/);
  assert.equal((html.match(/<article/g) || []).length, 2);
  assert.equal((html.match(/<img/g) || []).length, 1);
  assert.match(html, /A_LONG_PROJECT_TITLE_WITHOUT_SPACES/);
});

test('covers select plant, device and data themes from project content', () => {
  for (const [description, label] of [['IoT plant cultivation with Tableau', 'Plant Monitoring'], ['Arduino sensor', 'Connected Devices'], ['Tableau analytics', 'Data &amp; Insights']]) {
    const html = renderToStaticMarkup(React.createElement(FeaturedProjects, {
      projects: [{ id: description, title: 'Project', description, tech_stack: [], image_url: null }],
    }));
    assert.ok(html.includes(label), description);
    assert.doesNotMatch(html, /<img/);
  }
});

test('empty featured list does not render a section', () => {
  assert.equal(renderToStaticMarkup(React.createElement(FeaturedProjects, { projects: [] })), '');
});
