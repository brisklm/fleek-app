"use client";

import React, { useState, useEffect } from "react";

const GRID_SIZE = 10; // 10x10 grid
const CELL_SIZE = 50;

const getRandomPosition = () => ({
  x: Math.floor(Math.random() * GRID_SIZE),
  y: Math.floor(Math.random() * GRID_SIZE),
});

const ZombieEscape = () => {
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [zombies, setZombies] = useState([
    getRandomPosition(),
    getRandomPosition(),
  ]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const movePlayer = (dx: number, dy: number) => {
    setPlayerPos((prev) => {
      const newX = Math.min(Math.max(prev.x + dx, 0), GRID_SIZE - 1);
      const newY = Math.min(Math.max(prev.y + dy, 0), GRID_SIZE - 1);
      return { x: newX, y: newY };
    });
  };

  const moveZombies = () => {
    setZombies((prev) =>
      prev.map((zombie) => {
        const dx = playerPos.x > zombie.x ? 1 : playerPos.x < zombie.x ? -1 : 0;
        const dy = playerPos.y > zombie.y ? 1 : playerPos.y < zombie.y ? -1 : 0;
        return { x: zombie.x + dx, y: zombie.y + dy };
      })
    );
  };

  const checkCollision = () => {
    if (zombies.some((zombie) => zombie.x === playerPos.x && zombie.y === playerPos.y)) {
      setGameOver(true);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (gameOver) return;

    if (e.key === "ArrowUp") movePlayer(0, -1);
    if (e.key === "ArrowDown") movePlayer(0, 1);
    if (e.key === "ArrowLeft") movePlayer(-1, 0);
    if (e.key === "ArrowRight") movePlayer(1, 0);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playerPos, gameOver]);

  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      moveZombies();
      checkCollision();
      setScore((prev) => prev + 1);
    }, 500);

    return () => clearInterval(interval);
  }, [playerPos, zombies, gameOver]);

  const restartGame = () => {
    setPlayerPos({ x: 0, y: 0 });
    setZombies([getRandomPosition(), getRandomPosition()]);
    setScore(0);
    setGameOver(false);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#222",
        color: "#fff",
      }}
    >
      <h1>Zombie Escape</h1>
      <p>
        <strong>Controls:</strong> Arrow Keys to Move
      </p>
      <p>Score: {score}</p>
      {gameOver && <h2 style={{ color: "red" }}>Game Over!</h2>}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
          gap: "1px",
          backgroundColor: "#333",
          padding: "5px",
        }}
      >
        {Array.from({ length: GRID_SIZE }).map((_, row) =>
          Array.from({ length: GRID_SIZE }).map((_, col) => (
            <div
              key={`${row}-${col}`}
              style={{
                width: CELL_SIZE,
                height: CELL_SIZE,
                backgroundColor:
                  playerPos.x === col && playerPos.y === row
                    ? "#00f"
                    : zombies.some((zombie) => zombie.x === col && zombie.y === row)
                    ? "#f00"
                    : "#555",
                border: "1px solid #000",
              }}
            />
          ))
        )}
      </div>
      {gameOver && (
        <button
          onClick={restartGame}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Restart
        </button>
      )}
    </div>
  );
};

export default ZombieEscape;
