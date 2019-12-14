const _ = require('underscore');

function extractCardInformation(card) {
  return card.name;
}

class ListToCsvWriter {
  constructor(listsWithCards) {
    this.listsWithCards = listsWithCards;
  }

  /**
   * Generates an array of arrays with the list name as the first element and the card information
   * as the subsequent elements
   */
  generateArrays() {
    return this.listsWithCards.map(({ listName, cards }) => {
      return [listName].concat(cards.map(extractCardInformation));
    });
  }

  generateCsv() {
    return _.zip(...this.generateArrays());
  }
}

module.exports = ListToCsvWriter;
