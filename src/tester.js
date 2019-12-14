const path = require('path');
const BoardExtractor = require('./boardExtractor');
const ListToCsvWriter = require('./listToCsvWriter');

require('dotenv').config();

const key = process.env.TRELLO_KEY;
const token = process.env.TRELLO_TOKEN;

const daOrgId = process.env.ORG_ID;

(async () => {
  const boardExtractor = new BoardExtractor(key, token, daOrgId);
  const boardId = await boardExtractor.getBoardIdByName('Dash #86');
  const listsWithCards = await boardExtractor.getBoardListsWithCardsById(boardId);

  const csver = new ListToCsvWriter(listsWithCards);
  csver.writeToCsv(path.resolve(process.cwd(), 'tmp.csv'));
})();
