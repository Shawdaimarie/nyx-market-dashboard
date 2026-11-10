const {chromium} = require('playwright');
const AxeBuilder = require('@axe-core/playwright').default;
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
(async () => {
 const server = http.createServer((req,res) => {res.setHeader('Content-Type','text/html');res.end(fs.readFileSync(path.join(__dirname,'../market-dashboard.html')));});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch();
 try { for (const width of [390,1440]) {
  const context=await browser.newContext({viewport:{width,height:900}});
  const page=await context.newPage();
  await page.route('**/api/messages',r=>r.fulfill({json:{content:[{type:'text',text:JSON.stringify([{source:'untrusted',title:'<img src=x onerror="window.injected=1">',summary:'<svg onload="window.injected=1">',url:'javascript:alert(1)'}])}]}}));
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  assert.deepEqual(audit.violations.map(v=>v.id),[]);
  await page.locator('[data-tab=learn]').click();await page.locator('#headlines-btn').click();
  await page.locator('.headline-title').waitFor();
  assert.match(await page.locator('.headline-title').textContent(),/<img/);
  assert.equal(await page.locator('.headline-card img, .headline-card svg, .headline-card a').count(),0);
  assert.equal(await page.evaluate(()=>window.injected===1),false);
  await context.close();
 }} finally {await browser.close();server.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
