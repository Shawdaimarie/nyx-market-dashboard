const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const crypto = require('node:crypto');
const source = fs.readFileSync(path.join(__dirname, '../market-dashboard.html'), 'utf8');
const script = source.match(/<script>([\s\S]*?)<\/script>/)[1];
// Exercise the actual outbound gateway without executing the dashboard UI.
const gateway = script.slice(script.indexOf('  async function fetchWithRetry'), script.indexOf('  const refreshBtn'));
let requests = 0;
const context = vm.createContext({ fetch: () => { requests++; } });
vm.runInContext(gateway, context);
const renderGuards = script.slice(script.indexOf('  function escapeHTML'), script.indexOf('  function fmtUsd'));
vm.runInContext(renderGuards, context);
context.URL = URL;
assert.equal(vm.runInContext("safeExternalURL('javascript:alert(1)')", context), '');
assert.equal(vm.runInContext("safeExternalURL('https://user:secret@example.com')", context), '');
assert.equal(vm.runInContext("safeExternalURL('https://example.com/report')", context), 'https://example.com/report');
context.hostile = '<img src=x onerror="alert(1)">';
assert.equal(vm.runInContext('escapeHTML(hostile)', context), '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;');
const hash = crypto.createHash('sha256').update(script).digest('base64');
assert.ok(source.includes("'sha256-" + hash + "'"), 'CSP must authorize the exact reviewed inline script');
(async () => {
  await assert.rejects(vm.runInContext("fetchWithRetry('https://api.anthropic.com/v1/messages', {method:'POST'})", context), /disabled/);
  assert.equal(requests, 0, 'No request may reach a remote model or financial tool');
  assert.ok(source.includes("connect-src 'none'"));
  assert.match(source, /chart\.umd\.min\.js" integrity="sha384-[A-Za-z0-9+/=]+" crossorigin="anonymous"/);
  console.log('PASS: live requests fail closed, CSP blocks connections, external script has integrity pin');
})().catch(error => { console.error(error); process.exitCode = 1; });
