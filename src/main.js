/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
const puppeteer = require('puppeteer');
const Table = require('cli-table');

const GEO = 'BR';
const BASE_URL = `https://trends.google.com.br/trends/?geo=${GEO}`;

const table = new Table({
  head: ['Main Word', 'Issued Related', 'Rising Value'],
});

const main = {

  browser: null,
  page: null,

  initialize: async () => {
    main.browser = await puppeteer.launch({
      headless: false,
    });

    main.page = await main.browser.newPage();
  },

  search_word: async (word) => {
    await main.page.goto(BASE_URL, { waitUntil: 'networkidle2' });
    await main.page.waitFor(2000);
    await main.page.type('input[placeholder="Insira um termo de pesquisa ou um assunto"]', word, { delay: 50 });
    await main.page.keyboard.press('Enter');
  },

  get_word_data: async (word) => {
    await main.page.waitFor(2000);
    await main.page.waitForXPath("(//span[@ng-bind='bidiText'])[1]");
    await main.page.waitForXPath("(//div[@class='rising-value'])[1]");

    const issuedRelated = await main.page.$x("(//span[@ng-bind='bidiText'])");
    const risingValue = await main.page.$x('(//div[@class=\'rising-value\'])');

    for (let i = 0; i < issuedRelated.length; i++) {
      const issuedRelatedText = await main.page.evaluate((el) => el.textContent, issuedRelated[i]);
      const risingValueText = await main.page.evaluate((el) => el.textContent, risingValue[i]);

      table.push([word, issuedRelatedText, risingValueText]);
    }

    console.log(table.toString());
  },

};

module.exports = main;
