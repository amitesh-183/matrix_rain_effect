import React, { useState, useEffect } from "react";

const GRID_COLS = 15;
const GRID_ROWS = 20;
const TRAIL_LENGTH = 5;

export default function RainGrid() {
  const [grid, setGrid] = useState(
    Array(GRID_ROWS)
      .fill()
      .map(() => Array(GRID_COLS).fill(0))
  );
  const [currentColor, setCurrentColor] = useState("#00ff00");
  const [drops, setDrops] = useState(
    Array(GRID_COLS)
      .fill()
      .map(() => ({
        y: Math.floor(Math.random() * -GRID_ROWS),
        speed: 1 + Math.random(),
        active: Math.random() > 0.5,
        completed: false,
      }))
  );

  const getRandomColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setDrops((prevDrops) => {
        const newDrops = prevDrops.map((drop) => {
          const newY = drop.y + drop.speed;

          if (newY > GRID_ROWS) {
            return {
              y: -TRAIL_LENGTH,
              speed: 1 + Math.random(),
              active: Math.random() > 0.3,
              completed: true,
            };
          }

          return {
            ...drop,
            y: newY,
          };
        });

        if (newDrops.every((drop) => drop.completed)) {
          setCurrentColor(getRandomColor());
          return newDrops.map((drop) => ({
            ...drop,
            completed: false,
          }));
        }

        return newDrops;
      });

      setGrid((prevGrid) => {
        const newGrid = Array(GRID_ROWS)
          .fill()
          .map(() => Array(GRID_COLS).fill(0));

        drops.forEach((drop, x) => {
          if (!drop.active) return;

          for (let i = 0; i < TRAIL_LENGTH; i++) {
            const rowPos = Math.floor(drop.y) - i;
            if (rowPos >= 0 && rowPos < GRID_ROWS) {
              const opacity = 1 - i / TRAIL_LENGTH;
              newGrid[rowPos][x] = opacity;
            }
          }
        });

        return newGrid;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [drops]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
      <h1 className="text-4xl text-white mb-8">Digital Rain Grid</h1>
      <div
        className="grid gap-1 border py-4 px-1"
        style={{
          gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))`,
          backgroundColor: "black",
          borderRadius: "8px",
        }}
      >
        {grid.map((row, y) =>
          row.map((opacity, x) => (
            <div
              key={`${y}-${x}`}
              className="w-5 h-5 rounded-sm transition-colors duration-75"
              style={{
                backgroundColor: opacity === 0 ? "#333" : currentColor,
                opacity: opacity || 0.2,
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
