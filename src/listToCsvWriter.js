const _ = require('underscore');
const csv = require('fast-csv');

function extractCardInformation(card) {
  let cardWithComments = `${card.name}`;

  if (card.comments.length > 0) {
    cardWithComments += '\n---\n';
    cardWithComments += card.comments.join('\n');
  }

  return cardWithComments;
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

  writeToCsv(path) {
    const csvReadyArrays = _.zip(...this.generateArrays());
    csv
      .writeToPath(path, csvReadyArrays)
      .on('error', err => console.error(err))
      .on('finish', () => console.log('Done writing.'));
  }
}

module.exports = ListToCsvWriter;
