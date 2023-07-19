import readline from 'readline'
import puppeteer from 'puppeteer';
import Table from 'cli-table';

const table = new Table({
  head: ['Main Word', 'Issued Related', 'Rising Value'],
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
rl.on('line', (word) => {
  (async () => {
    const browser = await puppeteer.launch({
      headless: false,
    });
    const page = await browser.newPage();

    await page.goto('https://trends.google.com.br/trends/?geo=BR');

    // Set screen size
    await page.setViewport({ width: 1080, height: 1024 });

    await page.click('.VfPpkd-fmcmS-wGMbrd');
    await page.type('.VfPpkd-fmcmS-wGMbrd', word);
    await new Promise((resolve) => setTimeout(resolve, 5000))
    await page.keyboard.press('Enter');
    await new Promise((resolve) => setTimeout(resolve, 5000))

    await page.waitForXPath("(//span[@ng-bind='bidiText'])[1]");
    await page.waitForXPath("(//div[@class='rising-value'])[1]");
    const issuedRelated = await page.$x("(//span[@ng-bind='bidiText'])");
    const risingValue = await page.$x('(//div[@class=\'rising-value\'])');
    for (let i = 0; i < issuedRelated.length; i++) {
      const issuedRelatedText = await page.evaluate((el) => el.textContent, issuedRelated[i]);
      const risingValueText = await page.evaluate((el) => el.textContent, risingValue[i]);

      table.push([word, issuedRelatedText, risingValueText]);
    }

    console.log(table.toString());
  })();
});
