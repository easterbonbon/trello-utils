const jp = require('jsonpath');

class BoardExtractor {
  constructor(trello, orgId) {
    this.trello = trello;
    this.orgId = orgId;
  }

  async getBoardIdByName(name) {
    const boards = await this.trello.getOrgBoards(this.orgId);
    const results = jp.query(boards, `$..[?(@.name=="${name}")]`);

    // TODO: should handle error with exception?
    return results.length > 0 ? results[0].id : undefined;
  }

  async getBoardById(id, attributes = {}) {
    const lists = await this.trello.getListsOnBoard(id);
    console.log(lists);
  }
}

module.exports = BoardExtractor;
