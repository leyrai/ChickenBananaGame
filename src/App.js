import React, { useState, useEffect } from 'react';
import './App.css';

const chickenUrl = 'https://thumbs.dreamstime.com/z/full-body-brown-chicken-hen-standing-isolated-white-backgroun-background-use-farm-animals-livestock-theme-49741285.jpg?ct=jpeg';
const bananaUrl = 'https://thumbs.dreamstime.com/b/bunch-bananas-6175887.jpg?w=768';

function shuffleArray(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function generateBalancedGrid() {
  const half = 18;
  const chickens = Array(half).fill(chickenUrl);
  const bananas = Array(half).fill(bananaUrl);
  const combined = [...chickens, ...bananas];
  return shuffleArray(combined);
}

function App() {
  const totalTiles = 36;
  const [images, setImages] = useState(generateBalancedGrid);
  const [revealed, setRevealed] = useState(Array(totalTiles).fill(false));
  const [gameStarted, setGameStarted] = useState(false);
  const [players, setPlayers] = useState({ chicken: false, banana: false });
  const [winner, setWinner] = useState(null);
  const [clickCounts, setClickCounts] = useState({ chicken: 0, banana: 0 });

  // Reveal all tiles when there's a winner
  useEffect(() => {
    if (winner) {
      setRevealed(Array(totalTiles).fill(true));
    }
  }, [winner]);

  const handleClick = (index, player) => {
    if (revealed[index] || winner || !player) return;

    const img = images[index];
    const isChicken = img === chickenUrl;
    const isBanana = img === bananaUrl;

    const updatedRevealed = [...revealed];
    updatedRevealed[index] = true;
    setRevealed(updatedRevealed);

    const isMistake = (player === 'chicken' && isBanana) || (player === 'banana' && isChicken);
    if (isMistake) {
      const other = player === 'chicken' ? 'banana' : 'chicken';
      setWinner(`🎉 ${other === 'chicken' ? '🐔 Chicken' : '🍌 Banana'} Player Wins by Opponent's Mistake! (+5 Points)`);
      return;
    }

    const updatedCounts = {
      ...clickCounts,
      [player]: clickCounts[player] + 1,
    };
    setClickCounts(updatedCounts);

    if (updatedCounts[player] >= 18) {
      setWinner(`🎉 ${player === 'chicken' ? '🐔 Chicken' : '🍌 Banana'} Player Wins by Finishing First! (+5 Points)`);
    }
  };

  const resetGame = () => {
    setImages(generateBalancedGrid());
    setRevealed(Array(totalTiles).fill(false));
    setGameStarted(false);
    setPlayers({ chicken: false, banana: false });
    setWinner(null);
    setClickCounts({ chicken: 0, banana: 0 });
  };

  const chooseSide = (side) => {
    const updatedPlayers = { ...players, [side]: true };
    setPlayers(updatedPlayers);

    if (updatedPlayers.chicken && updatedPlayers.banana) {
      setGameStarted(true);
    }
  };

  return (
    <>
      <h1 className="game-title">Chicken Banana Game!</h1>
      <div className="container">
        {!gameStarted ? (
          <>
            <h2>Select Your Side</h2>
            <div className="side-select">
              <button
                className="side-btn"
                onClick={() => chooseSide('chicken')}
                disabled={players.chicken}
              >
                🐔 Play as Chicken
              </button>
              <button
                className="side-btn"
                onClick={() => chooseSide('banana')}
                disabled={players.banana}
              >
                🍌 Play as Banana
              </button>
            </div>
          </>
        ) : (
          <>
            {winner ? (
              <h2 className="winner">{winner}</h2>
            ) : (
              <h2 style={{ color: '#8f8fff' }}>
                Click the same tile simultaneously!
              </h2>
            )}
            <div style={{ marginBottom: '1rem', color: '#ccc' }}>
              <p>🐔 Chicken: {clickCounts.chicken}/18 | 🍌 Banana: {clickCounts.banana}/18</p>
            </div>
            <button className="reset-btn" onClick={resetGame}>Restart Game</button>
            <div className="grid">
              {images.map((img, index) => (
                <div
                  key={index}
                  className="square"
                  onClick={() => {
                    if (players.chicken) handleClick(index, 'chicken');
                    if (players.banana) handleClick(index, 'banana');
                  }}
                  style={{
                    backgroundImage: revealed[index] ? `url(${img})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    color: revealed[index] ? 'transparent' : '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                  }}
                >
                  {!revealed[index] ? index + 1 : ''}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
