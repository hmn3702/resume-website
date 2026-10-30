const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const { test } = require('node:test');

// Exercise form handlers without adding a DOM or test-framework dependency.
function mount(file, auth, url = 'http://localhost:3000/auth/reset-password') {
  const states = [];
  const effects = [];
  let cursor = 0;
  const filename = path.resolve(file);
  const componentModule = new Module(filename, module);
  componentModule.filename = filename;
  componentModule.paths = Module._nodeModulePaths(path.dirname(filename));
  componentModule.require = (name) => {
    if (name === 'react') return {
      useState(initial) {
        const index = cursor++;
        if (!(index in states)) states[index] = initial;
        return [states[index], value => { states[index] = value; }];
      },
      useEffect(effect) { if (!mounted) effects.push(effect); },
    };
    if (name === '@/lib/supabase-browser') return { createSupabaseBrowserClient: () => ({ auth }) };
    if (name === 'next/navigation') return { useRouter: () => ({ push() {}, refresh() {} }) };
    return require(name);
  };
  let mounted = false;
  componentModule._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  }).outputText, filename);
  global.window = { location: new URL(url), history: { replaceState() {} } };
  function render() {
    cursor = 0;
    const tree = componentModule.exports.default();
    mounted = true;
    return tree;
  }
  return { render, async initialize() { render(); for (const effect of effects) effect(); await new Promise(resolve => setImmediate(resolve)); } };
}

function elements(tree) {
  if (!tree || typeof tree !== 'object') return [];
  return [tree, ...[tree.props?.children].flat(Infinity).flatMap(elements)];
}
const event = { preventDefault() {} };

test('login sends recovery email to the reset page on the current origin', async () => {
  let request;
  const page = mount('app/admin/login/page.tsx', {
    async resetPasswordForEmail(...args) { request = args; return { error: null }; },
  });
  let nodes = elements(page.render());
  nodes.find(node => node.props?.id === 'email').props.onChange({ target: { value: 'admin@example.com' } });
  nodes = elements(page.render());
  const forgot = nodes.find(node => node.type === 'button' && node.props.children === 'Forgot password?');
  assert.ok(forgot, 'Login needs a Forgot password? button');
  await forgot.props.onClick();
  assert.deepEqual(request, ['admin@example.com', { redirectTo: 'http://localhost:3000/auth/reset-password' }]);
  assert.ok(elements(page.render()).some(node => node.props?.role === 'status'));
});

test('reset rejects mismatched passwords then updates and signs out', async () => {
  let updated;
  let signedOut = false;
  const page = mount('app/auth/reset-password/page.tsx', {
    async getUser() { return { data: { user: { id: 'admin' } }, error: null }; },
    async updateUser(value) { updated = value; return { error: null }; },
    async signOut() { signedOut = true; return { error: null }; },
  });
  await page.initialize();
  let nodes = elements(page.render());
  nodes.find(node => node.props?.id === 'password').props.onChange({ target: { value: 'a-new-password' } });
  nodes.find(node => node.props?.id === 'confirm-password').props.onChange({ target: { value: 'different-password' } });
  await elements(page.render()).find(node => node.type === 'form').props.onSubmit(event);
  assert.equal(updated, undefined);
  assert.ok(elements(page.render()).some(node => node.props?.role === 'alert'));
  elements(page.render()).find(node => node.props?.id === 'confirm-password').props.onChange({ target: { value: 'a-new-password' } });
  await elements(page.render()).find(node => node.type === 'form').props.onSubmit(event);
  assert.deepEqual(updated, { password: 'a-new-password' });
  assert.equal(signedOut, true);
  assert.ok(elements(page.render()).some(node => node.props?.role === 'status'));
});

test('expired recovery link cannot show a password form', async () => {
  const page = mount('app/auth/reset-password/page.tsx', {}, 'http://localhost:3000/auth/reset-password#error=access_denied&error_code=otp_expired');
  await page.initialize();
  const nodes = elements(page.render());
  assert.ok(nodes.some(node => node.props?.role === 'alert'));
  assert.equal(nodes.some(node => node.type === 'form'), false);
});

test('reset page rejects missing sessions', async () => {
  const page = mount('app/auth/reset-password/page.tsx', {
    async getUser() { return { data: { user: null }, error: null }; },
  });
  await page.initialize();
  const nodes = elements(page.render());
  assert.ok(nodes.some(node => node.props?.role === 'alert'));
  assert.equal(nodes.some(node => node.type === 'form'), false);
});

test('email delivery failure is visible and allows retry', async () => {
  const page = mount('app/admin/login/page.tsx', {
    async resetPasswordForEmail() { throw new Error('Network unavailable'); },
  });
  elements(page.render()).find(node => node.props?.id === 'email').props.onChange({ target: { value: 'admin@example.com' } });
  await elements(page.render()).find(node => node.type === 'button' && node.props.children === 'Forgot password?').props.onClick();
  const nodes = elements(page.render());
  assert.ok(nodes.some(node => node.props?.role === 'alert'));
  assert.equal(nodes.find(node => node.type === 'button' && node.props.children === 'Forgot password?').props.disabled, false);
});
