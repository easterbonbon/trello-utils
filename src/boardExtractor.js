const jp = require('jsonpath');

async function getBoardIdByName(trello, orgId, name) {
  const boards = await trello.getOrgBoards(orgId);
  const results = jp.query(boards, `$..[?(@.name=="${name}")]`);

  // TODO: should handle error with exception?
  return results.length > 0 ? results[0].id : undefined;
}

async function getCardCommentsByCardId(trello, id) {
  const actions = await trello.makeRequest('get', `/1/cards/${id}/actions`, {
    filter: 'commentCard',
    format: 'list',
    memberCreator: false,
    member: false,
    fields: 'data'
  });

  return actions.map(action => action.data.text);
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
