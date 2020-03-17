const _ = require('underscore');
const csv = require('fast-csv');

function extractCardInformation(card, extractCreator = false) {
  let cardWithComments = `${card.name}\n`;

  if (card.desc !== '') {
    cardWithComments += '\n== Description ==\n';
    cardWithComments += `${card.desc}\n`;
  }

  const hasComments = card.comments.length > 0;
  if (hasComments) {
    cardWithComments += '\n== Comments ==\n';

    card.comments.forEach(comment => {
      const creator = comment.memberCreator.fullName;
      const { text } = comment;
      const formattedComment = extractCreator ? `${creator}: ${text}` : text;
      cardWithComments += `${formattedComment}\n`;
    });
  }

  return cardWithComments;
}

class ListToCsvWriter {
  constructor(listsWithCards, options = { appendCommentCreator: false }) {
    this.listsWithCards = listsWithCards;
    this.options = options;
  }

  /**
   * Generates an array of arrays with the list name as the first element and the card information
   * as the subsequent elements
   */
  generateArrays() {
    return this.listsWithCards.map(({ listName, cards }) => {
      return [listName].concat(
        cards.map(extractCardInformation, this.options.appendCommentCreator)
      );
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
