import React, { useState } from "react";
import "./styles.css";

import GameScreen from "./components/GameScreen";
import GamepadController from "./components/GamepadController";

export default function App() {
  return (
    <div className="App">
      <GamepadController />
    </div>
  );
}
