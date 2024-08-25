import React, { useState } from "react";
import Board from "./components/Board";

function App() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [isSinglePlayer, setIsSinglePlayer] = useState(true);

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  };

  const aiMove = (squares) => {
    // AI tries to win, block the player, or take the first available square
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    // Check if AI can win
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] === "O" && squares[a] === squares[b] && !squares[c])
        return c;
      if (squares[a] === "O" && squares[a] === squares[c] && !squares[b])
        return b;
      if (squares[b] === "O" && squares[b] === squares[c] && !squares[a])
        return a;
    }
    // Block player from winning
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] === "X" && squares[a] === squares[b] && !squares[c])
        return c;
      if (squares[a] === "X" && squares[a] === squares[c] && !squares[b])
        return b;
      if (squares[b] === "X" && squares[b] === squares[c] && !squares[a])
        return a;
    }
    // Take first available square
    for (let i = 0; i < squares.length; i++) {
      if (!squares[i]) return i;
    }
    return null;
  };

  const handleClick = (index) => {
    const squaresCopy = [...squares];
    if (calculateWinner(squaresCopy) || squaresCopy[index]) return;
    squaresCopy[index] = isXNext ? "X" : "O";
    setSquares(squaresCopy);
    // Check if this move results in a win
    const currentWinner = calculateWinner(squaresCopy);
    if (currentWinner) {
      return currentWinner; // No further moves should be made if there's a winner
    }

    // After player move, check if there's a winner
    const nextIsXNext = !isXNext;
    setIsXNext(nextIsXNext);
    // If it's AI's turn and the game isn't over, make the AI move
    if (!nextIsXNext && isSinglePlayer) {
      const move = aiMove(squaresCopy);
      if (move !== null) {
        setTimeout(() => {
          squaresCopy[move] = "O";
          setSquares([...squaresCopy]);
          setIsXNext(true);
        }, 300); // Small delay to make the AI's move feel more natural
      }
    }
  };

  const winner = calculateWinner(squares);
  const status = winner
    ? `Winner: ${winner}`
    : `Next player: ${isXNext ? "X" : "O"}`;

  const gameMode = isSinglePlayer ? "Single Player" : "Two Player";

  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setIsXNext(true);
  };

  const handleGameType = (value) => {
    setIsSinglePlayer(value);
  };

  return (
    <div className="App">
      <div className="status">{gameMode}</div>
      <div className="status">{status}</div>
      <Board squares={squares} onClick={handleClick} />
      <button className="button" onClick={resetGame}>
        Reset
      </button>
      <button className="button" onClick={() => handleGameType(true)}>
        Single Player
      </button>
      <button className="button" onClick={() => handleGameType(false)}>
        Two Player
      </button>
    </div>
  );
}

export default App;
