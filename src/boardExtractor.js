const Trello = require('trello');
const jp = require('jsonpath');

class BoardExtractor {
  constructor(key, token, orgId) {
    this.trello = new Trello(key, token);
    this.orgId = orgId;
  }

  async getBoardIdByName(name) {
    const boards = await this.trello.getOrgBoards(this.orgId);
    const results = jp.query(boards, `$..[?(@.name=="${name}")]`);

    // TODO: should handle error with exception?
    return results.length > 0 ? results[0].id : undefined;
  }

  async getBoardListsWithCardsById(id) {
    const lists = await this.trello.getListsOnBoard(id);

    const promises = lists.map(async list => {
      return {
        listName: list.name,
        cards: await this.trello.getCardsOnList(list.id)
      };
    });
    const listsWithCards = await Promise.all(promises);
    return listsWithCards;
  }
}

module.exports = BoardExtractor;
