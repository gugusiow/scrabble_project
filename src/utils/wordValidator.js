// src/utils/wordValidator.js
import { wordDictionary } from '../wordDictionary';

const isValidWord = (word) => {
  return wordDictionary.includes(word.toUpperCase());
};

const extractWordsFromBoard = (board) => {
  const boardSize = 15;
  const words = [];

  // Extract horizontal words
  for (let row = 0; row < boardSize; row++) {
    let word = "";
    for (let col = 0; col < boardSize; col++) {
      const tile = board[row * boardSize + col];
      if (tile) {
        word += tile;
      } else {
        if (word.length > 1) words.push(word);
        word = "";
      }
    }
    if (word.length > 1) words.push(word);
  }

  // Extract vertical words
  for (let col = 0; col < boardSize; col++) {
    let word = "";
    for (let row = 0; row < boardSize; row++) {
      const tile = board[row * boardSize + col];
      if (tile) {
        word += tile;
      } else {
        if (word.length > 1) words.push(word);
        word = "";
      }
    }
    if (word.length > 1) words.push(word);
  }

  return words;
};

export const validateWords = (board) => {
  const words = extractWordsFromBoard(board);
  return words.every(isValidWord);
};
