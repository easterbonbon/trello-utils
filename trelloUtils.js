const yargs = require('yargs');
const { writeBoardToCsv } = require('./boardToCsv');

(async () => {
  const { argv } = yargs
    .command('writeBoardToCsv <boardName> <filename>')
    .alias('b', 'boardname')
    .help();

  console.log(argv);
  writeBoardToCsv(argv.boardName, argv.filename);
})();
