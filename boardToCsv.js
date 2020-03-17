const path = require('path');
const Trello = require('trello');
const BoardExtractor = require('./src/boardExtractor');
const ListToCsvWriter = require('./src/listToCsvWriter');

require('dotenv').config();

const key = process.env.TRELLO_KEY;
const token = process.env.TRELLO_TOKEN;

const daOrgId = process.env.ORG_ID;

async function writeBoardToCsv(boardName, filename) {
  console.log('== Writing board to CSV ==');

  const trello = new Trello(key, token);

  try {
    const boardId = await BoardExtractor.getBoardIdByName(trello, daOrgId, boardName);
    const listsWithCards = await BoardExtractor.getBoardListsWithCardsById(trello, boardId);
    const outputPath = path.resolve(process.cwd(), 'output', `${filename}.csv`);
    new ListToCsvWriter(listsWithCards).writeToCsv(outputPath);
  } catch (error) {
    console.error(error);
  }
}

module.exports = { writeBoardToCsv };
