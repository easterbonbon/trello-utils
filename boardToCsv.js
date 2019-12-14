const path = require('path');
const BoardExtractor = require('./src/boardExtractor');
const ListToCsvWriter = require('./src/listToCsvWriter');

require('dotenv').config();

const key = process.env.TRELLO_KEY;
const token = process.env.TRELLO_TOKEN;

const daOrgId = process.env.ORG_ID;

async function writeBoardToCsv(boardName, filename) {
  const boardExtractor = new BoardExtractor(key, token, daOrgId);
  const boardId = await boardExtractor.getBoardIdByName(boardName);
  const listsWithCards = await boardExtractor.getBoardListsWithCardsById(boardId);

  const outputPath = path.resolve(process.cwd(), `${filename}.csv`);
  new ListToCsvWriter(listsWithCards).writeToCsv(outputPath);
}

module.exports = { writeBoardToCsv };
