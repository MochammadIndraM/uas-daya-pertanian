import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { answersFor } from './fixture.mjs';
import { readFile } from 'node:fs/promises';

export async function browserFlow(base, config) {
  const browser = await chromium.launch({channel:'chrome',headless:true});
  const context = await browser.newContext({viewport:{width:1366,height:900},acceptDownloads:true});
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror',error => errors.push(error.message));
  try {
    await page.goto(base);
    await page.locator('#full-name').fill('Peserta Browser Fiktif');
    await page.locator('#nim').fill('UIFIKTIF01');
    await page.locator('#group').selectOption('B');
    await page.locator('#start-code').fill('salah');
    await page.locator('#start-button').click();
    await page.locator('#start-error:not([hidden])').waitFor();
    assert.equal(await page.locator('#question-prompt').count(),0);
    assert.equal(await page.locator('#clock-time').count(),0);
    await page.locator('#start-code').fill(config.startCode);
    const startedResponse = page.waitForResponse(r => r.url().endsWith('/api/quiz/start') && r.status() === 200);
    await page.locator('#start-button').click();
    const initial = await (await startedResponse).json();
    await page.locator('#question-prompt').waitFor();
    await page.locator('input[name=answer]').first().check();
    assert.match(await page.locator('#progress-label').innerText(),/^1 dari 25/);
    // Simulasi event visibility browser; tidak mengklaim pengujian pindah tab di HP fisik.
    const resetResponse = page.waitForResponse(r => r.url().endsWith('/api/quiz/reset') && r.status() === 200);
    await page.evaluate(() => {
      Object.defineProperty(document,'hidden',{configurable:true,get:() => true});
      document.dispatchEvent(new Event('visibilitychange'));
    });
    const reset = await (await resetResponse).json();
    assert.equal(reset.attempt.resetCount,1);
    assert.equal(reset.attempt.deadlineAt,initial.attempt.deadlineAt);
    assert.notDeepEqual(reset.questions.map(q=>q.id).sort(),initial.questions.map(q=>q.id).sort());
    await page.evaluate(() => {
      Object.defineProperty(document,'hidden',{configurable:true,get:() => false});
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await page.waitForFunction(() => document.querySelector('#progress-label')?.textContent === '0 dari 25 dijawab');
    // Muat ulang mempertahankan tenggat; V4 membuang draf dan pagehide memicu reset.
    await page.reload();
    await page.locator('#question-prompt').waitFor();
    await page.waitForFunction(() => !document.querySelector('#retry-package'));
    const state = await page.evaluate(() => ({attempt,questions}));
    assert.equal(state.attempt.deadlineAt,initial.attempt.deadlineAt);
    const answers = answersFor(state.questions,19);
    for (let i=0;i<25;i++) {
      await page.locator(`input[name=answer][value="${answers[state.questions[i].id]}"]`).check();
      if (i<24) await page.locator('#next').click();
    }
    await page.locator('#submit-button').click();
    await page.getByRole('heading',{name:'Jawaban terkirim'}).waitFor();
    assert.match(await page.locator('.score').innerText(),/76/);
    await page.goto(base+'/rekap');
    await page.locator('#recap-code').fill(config.recapCode);
    await page.locator('#recap-login button[type="submit"]').click();
    await page.locator('#recap-rows tr').first().waitFor();
    assert.match(await page.locator('#recap-rows').innerText(),/UIFIKTIF01/);
    const downloadEvent = page.waitForEvent('download');
    await page.locator('#export').click();
    const download = await downloadEvent;
    await download.saveAs('test-results/browser-recap.csv');
    await page.screenshot({path:'test-results/recap-desktop.png',fullPage:true});
    const mobile = await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
    const mobilePage = await mobile.newPage();
    await mobilePage.goto(base);
    await mobilePage.locator('#start-code').waitFor();
    assert.equal(await mobilePage.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),true);
    await mobilePage.screenshot({path:'test-results/form-mobile.png',fullPage:true});
    await mobile.close();
    assert.deepEqual(errors,[]);
    return 'Chrome headless: formulir anonim, kode salah/benar, event visibility reset, reload, 25 jawaban, nilai 76, panel dan unduh CSV, viewport 390px';
  } finally { await browser.close(); }
}

export async function verifyLoadPanel(base,config,expected,csv,round) {
  const browser = await chromium.launch({channel:'chrome',headless:true});
  try {
    const page = await browser.newPage({acceptDownloads:true});
    await page.goto(base+'/rekap');
    await page.locator('#recap-code').fill(config.recapCode);
    await page.locator('#recap-login button[type="submit"]').click();
    await page.waitForFunction(() => document.querySelector('#count')?.textContent === '80');
    const rows = await page.locator('#recap-rows tr').evaluateAll(rows => rows.map(row=>[...row.cells].map(cell=>cell.textContent)));
    assert.equal(rows.length,80);
    const byNim = new Map(expected.map(p=>[p.nim,p]));
    rows.forEach(row => {const e=byNim.get(row[1]);assert.ok(e);assert.equal(row[0],e.fullName);assert.equal(row[2],e.group);assert.equal(row[3],`${e.correct}/25`);assert.equal(Number(row[4]),e.score);});
    for (const group of ['A','B','C']) {
      const desired=expected.filter(p=>p.group===group);
      await page.locator('#recap-group').selectOption(group);
      await page.waitForFunction(n=>document.querySelector('#count').textContent === String(n),desired.length);
      await page.waitForFunction(group=>[...document.querySelectorAll('#recap-rows tr')].every(row=>row.cells[2].textContent===group),group);
      assert.equal(await page.locator('#recap-rows tr').count(),desired.length);
    }
    await page.locator('#recap-group').selectOption('');
    await page.waitForFunction(() => document.querySelector('#count').textContent === '80');
    const pending=page.waitForEvent('download');await page.locator('#export').click();
    const download=await pending;const path=`test-results/round-${round}-browser.csv`;
    await download.saveAs(path);assert.equal(await readFile(path,'utf8'),csv);
    await page.screenshot({path:`test-results/round-${round}-panel.png`,fullPage:true});
  } finally {await browser.close();}
}
