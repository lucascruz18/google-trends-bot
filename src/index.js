const main = require('./main');

(async () => {
  await main.initialize();
  await main.search_word('Abacate');
  await main.get_word_data('Abacate');
})();
