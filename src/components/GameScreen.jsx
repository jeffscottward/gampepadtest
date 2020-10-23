import React, { useState, useEffect, useRef } from "react";
import useGamepads from "../hooks/useGamepads";
import useTimeout from "../hooks/useTimeout";
import useInterval from "../hooks/useInterval";
import Countdown from "./Countdown";

const GAME_DURATION = 30;
const PLAYER_POSITION_ADJUST = 1;

const calculateScore = (currentPosition) => {
  // Full score is 100 points
  // Gets reduced for the bigger difference
  // between starting position (500) and current
  const difference = 500 - currentPosition;
  const normalizedDiff =
    Math.sign(difference) === -1 ? difference * -1 : difference;
  const score = 100 - (normalizedDiff * 100) / 500;
  return score;
};

export default function GameScreen({ setGameStarted }) {
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const position = useRef(500);
  const [score, setScore] = useState(0);
  const [gamepads, setGamepads] = useState({});
  useGamepads((gamepads) => setGamepads(gamepads));

  // Starts game after 3 second countdown
  useTimeout(() => setStarted(true), 3000);
  // Ends game after 30 seconds (+ 3 seconds for pre)
  useTimeout(() => {
    setStarted(false);
    setGameOver(true);
  }, GAME_DURATION * 1000 + 3000);

  const endGameHandler = () => {
    setGameStarted(false);
  };

  const increasePosition = () => {
    position.current = position.current + PLAYER_POSITION_ADJUST;
  };
  const decreasePosition = () => {
    const newPosition = position.current - PLAYER_POSITION_ADJUST;
    position.current = newPosition > 0 ? newPosition : 0;
  };

  // Check for button input to change position
  useEffect(() => {
    if (started) {
      // If controller connected with buttons
      if (gamepads && gamepads[0] && gamepads[0].buttons.length > 0) {
        // Pressed Up
        if (gamepads[0].buttons[12].pressed) {
          // AwesomeDebouncePromise(() => increasePosition(), 300);
          increasePosition();
        }
        // Pressed Down
        if (gamepads[0].buttons[13].pressed) {
          // AwesomeDebouncePromise(() => decreasePosition(), 300);
          decreasePosition();
        }

        // Handle axes
        if ("axes" in gamepads[0]) {
          // Each analog stick is an "axe"
          // Axes are delivered in a array of 2 numbers per axe
          // The first is left and right
          // The second is top and bottom
          // If a number is -1 or 1, it's one side or the other

          // Up
          -0.2 > gamepads[0].axes[1] > 0.2 && increasePosition();
          // Down
          0.2 > gamepads[0].axes[1] < 0.2 && decreasePosition();
        }
      }
    }
    if (gameOver) {
      if (gamepads && gamepads[0] && gamepads[0].buttons.length > 0) {
        gamepads[0].buttons.forEach((button) => {
          if (button.pressed) {
            setGameStarted(false);
          }
        });
      }
    }
  }, [gamepads, started]);

  // Make position drop every second
  useInterval(() => {
    if (started) {
      const newPosition = position.current - 10;
      position.current = newPosition > 0 ? newPosition : 0;
      setScore((prevScore) =>
        Math.round(prevScore + calculateScore(position.current))
      );
    }
  }, 1000);

  // Game over screen
  if (gameOver) {
    return (
      <div>
        <h1>Game over!</h1>
        <h3>Final score: {score}</h3>
        <button onClick={endGameHandler}>Try again</button>
      </div>
    );
  }

  // Game is running
  if (started) {
    return (
      <div>
        <h1>Position: {position.current}</h1>
        <h3>Score: {score}</h3>
        <h5>
          Time left: <Countdown start={GAME_DURATION} />
        </h5>
      </div>
    );
  }

  // Countdown to game
  return <Countdown start={3} />;
}
