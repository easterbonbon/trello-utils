const path = require('path');
const Trello = require('trello');
const BoardExtractor = require('./boardExtractor');
const ListToCsvWriter = require('./listToCsvWriter');

require('dotenv').config();

const key = process.env.TRELLO_KEY;
const token = process.env.TRELLO_TOKEN;

const daOrgId = process.env.ORG_ID;

const trello = new Trello(key, token);

(async () => {
  const boardId = await BoardExtractor.getBoardIdByName(
    trello,
    daOrgId,
    'Phoenix Project - Ch 1, 2'
  );
  const listsWithCards = await BoardExtractor.getBoardListsWithCardsById(trello, boardId, true);

  const csver = new ListToCsvWriter(listsWithCards, { appendCommentCreator: true });
  csver.writeToCsv(path.resolve(process.cwd(), 'output', 'tmp.csv'));

  // Comment tester
  // const lists = await trello.getListsOnBoard(boardId);
  // const cards = await trello.getCardsOnList(lists[0].id);
  // const comments = await BoardExtractor.getCardCommentsByCardId(trello, cards[0].id);
  // console.log(comments);
})();
