import React, { useEffect, useState, useRef} from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "react-three-fiber";
import useGamepads from "../hooks/useGamepads";
import N64Controller from "../utils/N64Controller";


const Box = () => {
  const [gamepads, setGamepads] = useState({});
  const box = useRef();

  const dpadLogic = () => {
    if(gamepads[0]){
      if(N64Controller(gamepads[0]).dpad === 'UP'){
        box.current.rotation.x -= 0.02;
      }
      if(N64Controller(gamepads[0]).dpad === 'UPRIGHT'){
        box.current.rotation.x -= 0.02;
        box.current.rotation.y += 0.02;
      }
      if(N64Controller(gamepads[0]).dpad === 'RIGHT'){
        box.current.rotation.y += 0.02;
      }
      if(N64Controller(gamepads[0]).dpad === 'DOWNRIGHT'){
        box.current.rotation.x += 0.02;
        box.current.rotation.y += 0.02;
      }
      if(N64Controller(gamepads[0]).dpad === 'DOWN'){
        box.current.rotation.x += 0.02;
      }
      if(N64Controller(gamepads[0]).dpad === 'DOWNLEFT'){
        box.current.rotation.x += 0.02;
        box.current.rotation.y -= 0.02;
      }
      if(N64Controller(gamepads[0]).dpad === 'LEFT'){
        box.current.rotation.y -= 0.02;
      }
      if(N64Controller(gamepads[0]).dpad === 'UPLEFT'){
        box.current.rotation.y -= 0.02;
        box.current.rotation.x -= 0.02;
      }
    }
  }

  const analogLogic = () => {
    if(gamepads[0]){
      box.current.rotation.x += N64Controller(gamepads[0]).analog.y/50
      box.current.rotation.y += N64Controller(gamepads[0]).analog.x/50
    }
  }

  // Render Loop Hook
  useGamepads((gamepads) => {
    setGamepads(gamepads)
    dpadLogic()
    analogLogic()
  });  
  
  return (
    <mesh ref={ box } scale={ [10, 10, 10] }>
      <boxGeometry args={ [1, 1, 1] } />
      <meshStandardMaterial color={ 0x66c308 } />
    </mesh>
  );
}


export default function GamepadController() {
  const [gamepads, setGamepads] = useState({});
  useGamepads((gamepads) => {
    setGamepads(gamepads)
  });  

  return (
    <div style={{
      background: '#333',
      height: '100%'
    }}>
      <div
        className="Gamepads"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: '200px',
          textAlign: 'left'
        }}
      >
        {gamepads[0] && gamepads[0].id}
        {gamepads[0] && (
          <div style={{
            display: 'grid',
            placeItems: 'center',
            width: '100px',
            height: '100px',
            background: 
              N64Controller(gamepads[0]).dpad === 'UP'
              ? 'red'
              : N64Controller(gamepads[0]).dpad === 'UPRIGHT'
                ? 'orange'
                : N64Controller(gamepads[0]).dpad === 'RIGHT'
                  ? 'yellow'
                  : N64Controller(gamepads[0]).dpad === 'DOWNRIGHT'
                    ? 'green'
                    : N64Controller(gamepads[0]).dpad === 'DOWN'
                      ? 'blue'
                      : N64Controller(gamepads[0]).dpad === 'DOWNLEFT'
                        ? 'purple'
                        : N64Controller(gamepads[0]).dpad === 'LEFT'
                          ? 'brown'
                          : N64Controller(gamepads[0]).dpad === 'UPLEFT'
                            ? 'black'
                            : 'gray'
            }}
          >
            {N64Controller(gamepads[0]).dpad}
          </div>
        )}
      </div>
      <Canvas
        concurrent
        shadowMap
        gl={{ antialias: false, alpha: true }}
        camera={{
          position: [0, 0, 20],
          near: 0.01,
          far: 100
        }}
      >
        <ambientLight />
        <pointLight position={ [10, 10, 10] } />
        <Box />
      </Canvas>
      <style>{`
        html, body, #root, .App {
          width: 100vw;
          height: 100%;
          margin: 0;
          padding: 0;
          color: white;
        }
      `}
      </style>
    </div>
  );
}
