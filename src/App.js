import React, { useState, useEffect } from 'react';
import './App.css';
import Board from './components/Board';
import Rack from './components/Rack';
// import { validateWords } from './utils/wordValidator';

/*
  *** AS OF 19/8/2024, SCRABBOLEH TEST IS DONE AND PLAYABLE. JUST NOT A FULLY ACCURATE COPY OF SCRABBLE
    - issues: 
      > no random tile generator
      > no score multiplier squares
      > no timer
*/

const initialBoard = Array(225).fill(null);
const letterScores = {
  A: 1, B: 3, C: 3, D: 2, E: 1,
  F: 4, G: 2, H: 4, I: 1, J: 8,
  K: 5, L: 1, M: 3, N: 1, O: 1,
  P: 3, Q: 10, R: 1, S: 1, T: 1,
  U: 1, V: 4, W: 4, X: 8, Y: 4,
  Z: 10
};

function App() {
  const [board, setBoard] = useState(initialBoard);
  const [rack, setRack] = useState(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
    'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'  
  ]);
  const [currentTurnTiles, setCurrentTurnTiles] = useState([]);
  const [numPlayers, setNumPlayers] = useState(2);
  const [players, setPlayers] = useState([
    { name: "Player 1", score: 0 },
    { name: "Player 2", score: 0 }
  ]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [dictionary, setDictionary] = useState([]);

  useEffect(() => {
    fetch('/dic.json')
      .then(response => response.json())
      .then(data => setDictionary(data.words));
  }, []);

  const handleDragStart = (event, index, source) => {
    event.dataTransfer.setData("text/plain", index);
    event.dataTransfer.setData("source", source);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event, dropIndex, target) => {
    console.log('dropped tile');
    event.preventDefault();
    const dragIndex = event.dataTransfer.getData("text/plain");
    const source = event.dataTransfer.getData("source");

    if (source === 'rack' && target === 'board' && board[dropIndex] === null) {
      const newBoard = [...board];
      newBoard[dropIndex] = rack[dragIndex];
      setBoard(newBoard);

      setCurrentTurnTiles([...currentTurnTiles, dropIndex]);
    } else if (source === 'board' && target === 'rack' && rack[dropIndex] === null) {
      const newRack = [...rack];
      newRack[dropIndex] = board[dragIndex];
      const newBoard = [...board];
      newBoard[dragIndex] = null;
      setBoard(newBoard);

      setCurrentTurnTiles(currentTurnTiles.filter(tileIndex => tileIndex !== dragIndex));
    }
  };

  const clearBoard = () => {
    const newBoard = board.map((tile, index) => {
      if (currentTurnTiles.includes(index)) {
        return null;
      }
      return tile;
    });
    setBoard(newBoard);
    setCurrentTurnTiles([]);
  };

  const calculateScore = (board, currentTurnTiles) => {
    // const boardSize = 15;
    const words = extractWordsFromBoard(board, currentTurnTiles);
    let totalScore = 0;

    words.forEach(word => {
      let wordScore = 0;
      for (let i = 0; i < word.length; i++){
        wordScore += letterScores[word[i]] || 0;
      }
      totalScore += wordScore;
    });

    return totalScore;
  };
  //   currentTurnTiles.forEach(index => {
  //     const tile = board[index];
  //     if (tile) {
  //       score += letterScores[tile] || 0;
  //     }
  //   });
  //   return score;
  // };

  const validateWord = (word) => {
    return dictionary.includes(word.toUpperCase());
  };

  const endTurn = () => {
    const wordsFormed = extractWordsFromBoard(board, currentTurnTiles);
    const allValid = wordsFormed.every(word => validateWord(word));

    if (!allValid) {
      alert("Invalid word(s) formed!");
      return;
    }

    const score = calculateScore(board, currentTurnTiles);
    const updatedPlayers = players.map((player, index) => {
      if (index === currentPlayerIndex) {
        return { ...player, score: player.score + score };
      }
      return player;
    });
    setPlayers(updatedPlayers);
    setCurrentTurnTiles([]);
    setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
  };

  const handleNumPlayersChange = (event) => {
    const value = parseInt(event.target.value, 10);
    setNumPlayers(value);

    const newPlayers = [];
    for (let i = 0; i < value; i++) {
      newPlayers.push({ name: `Player ${i + 1}`, score: 0 });
    }
    setPlayers(newPlayers);
    setCurrentPlayerIndex(0); // Reset current player index to the first player
  };

  const extractWordsFromBoard = (board, currentTurnTiles) => {
    // Implement logic to extract words from the board
    const boardSize = 15; // Assuming a 15x15 board
    const words = new Set();

    const getWord = (index, step, boardSize) => {
      let word = '';
      let currentIndex = index;
      // Move backwards to the start of the word
      while (currentIndex >= 0 && board[currentIndex] !== null) {
        currentIndex -= step;
      }
      currentIndex += step; // Move back to the first valid tile

      // Move forwards to collect the word
      while (currentIndex < board.length && board[currentIndex] !== null) {
        word += board[currentIndex];
        currentIndex += step;
      }
    
      return word;
    };

    // Extract words from the current turn tiles
    currentTurnTiles.forEach(index => {
      // Check horizontal word
      const horizontalWord = getWord(index, 1, boardSize);
      if (horizontalWord.length > 1) words.add(horizontalWord);

      // Check vertical word
      const verticalWord = getWord(index, boardSize, boardSize);
      if (verticalWord.length > 1) words.add(verticalWord);
    });

    // This function should return an array of words formed
    return Array.from(words);
  };

  const endGame = () => {
    // Calculate final scores
    const finalScores = players.map(player => {
      let penalty = 0;
      rack.forEach(tile => {
        penalty += letterScores[tile] || 0;
      });
      // return { ...player, score: player.score - penalty };
      return { ...player, score: player.score }; // score without penalty
    });
  
    // Determine the winner
    const winner = finalScores.reduce((prev, current) => (prev.score > current.score) ? prev : current);
  
    // Announce the winner and final scores
    alert(`Game Over! The winner is ${winner.name} with ${winner.score} points.`);
    
    // Optionally, reset the game or navigate to a game over screen
    setGameOver(true);
  };
  
  // New state to manage the game over status
  const [gameOver, setGameOver] = useState(false); 
  const [finalScores, setFinalScores] = useState([]);

  // test commit
  const [balls] = "balls";

  const resetGame = () => {
    setBoard(initialBoard);  // Assuming you have an initial board setup
    setRack([
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
    'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
  ]);  // Or reinitialize the rack
    setPlayers(players.map(player => ({ ...player, score: 0 })));  // Reset players' scores
    setCurrentPlayerIndex(0);
    setGameOver(false);
  };
  

  return (
    <div className="app">
      <h1>HKMSA Scrabboleh Test</h1>
      {!gameOver ? (
      <div> 
        <div className="game-container">
          <Board board={board} onDragOver={handleDragOver} onDrop={(event, index) => handleDrop(event, index, 'board')} onDragStart={handleDragStart} />
          <Rack rack={rack} onDragStart={handleDragStart} onDragOver={handleDragOver} onDrop={(event, index) => handleDrop(event, index, 'rack')} />
        </div>
        <button onClick={clearBoard}>Clear Board</button>
        <button onClick={endTurn}>End Turn</button>
        <button onClick={endGame}>End Game</button>
        <div className="player-info">
          <label>
            Number of Players:
            <input type="number" value={numPlayers} onChange={handleNumPlayersChange} min="2" max="8" />
            {/* estimate 7 teams max for 0-day  */}
          </label>
        </div>
        <div className="scoreboard">
          {players.map((player, index) => (
            <div key={index} className={index === currentPlayerIndex ? 'current-player' : ''}>
              {player.name}: {player.score}
            </div>
          ))}
        </div>
      </div>
    ) : (
      <div>
        <h1>Game Over</h1>
        <ul>
          {finalScores.map((player, index) => (
            <li key={index}>{player.name}: {player.score} points</li>
          ))}
        </ul>
        <button onClick={resetGame}>Play Again</button>
      </div>
    )}
  </div>
);
}

export default App;

