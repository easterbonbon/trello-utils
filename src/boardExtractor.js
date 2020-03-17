const jp = require('jsonpath');

async function getBoardIdByName(trello, orgId, name) {
  const boards = await trello.getOrgBoards(orgId);
  const results = jp.query(boards, `$..[?(@.name=="${name}")]`);

  if (results.length === 0) {
    throw new Error(`Could not find board with name: ${name}`);
  }
  return results[0].id;
}

/**
 *
 * @param {*} trello
 * @param {*} id
 *
 * @returns {Array<Obj>} - [{ text, memberCreator: fullName }]
 */
async function getCardCommentsByCardId(trello, id) {
  const actions = await trello.makeRequest('get', `/1/cards/${id}/actions`, {
    filter: 'commentCard',
    format: 'list',
    memberCreator: true,
    member: false,
    fields: 'data,memberCreator'
  });

  return actions
    .map(action => {
      return {
        text: action.data.text,
        memberCreator: {
          fullName: action.memberCreator.fullName
        }
      };
    })
    .reverse();
}

async function getCardsByListId(trello, list, isMinimal = true) {
  const cards = await trello.getCardsOnList(list.id);
  return {
    listName: list.name,
    cards: isMinimal
      ? await Promise.all(
          cards.map(async card => {
            return {
              name: card.name,
              desc: card.desc,
              comments: await getCardCommentsByCardId(trello, card.id)
            };
          })
        )
      : cards
  };
}

/**
 * Fetch the cards of an entire board in relation to their respective lists given the board ID
 *
 * @param {*} id - Board ID
 * @param {*} opts
 *
 * @returns {Array<Object>} - An array of lists with the following structure: { listName - {String}, cards - {Array<Object>} }
 */
async function getBoardListsWithCardsById(trello, id, isMinimal = true) {
  const lists = await trello.getListsOnBoard(id);

  const listsWithCards = await Promise.all(
    lists.map(async list => getCardsByListId(trello, list, isMinimal))
  );
  return listsWithCards;
}

module.exports = {
  getBoardIdByName,
  getCardCommentsByCardId,
  getCardsByListId,
  getBoardListsWithCardsById
};
