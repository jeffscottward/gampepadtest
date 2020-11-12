const buttonOrder = [ 'CUP', 'CRIGHT', 'CDOWN', 'CLEFT', 'L', 'R', 'A', 'Z', 'B', 'START' ]
const dpadMap = {
  '-1': 'UP',
  '-0.7142857142857143': 'UPRIGHT',
  '-0.4285714285714286': 'RIGHT',
  '-0.1428571428571429': 'DOWNRIGHT',
  '0.1428571428571428': 'DOWN',
  '0.4285714285714286': 'DOWNLEFT',
  '0.7142857142857142': 'LEFT',
  '1': 'UPLEFT',
  '3.2857142857142856': 'NONE',
}
const buttonMap = (buttons) => {
  return buttons.map((button, idx) => {
    if(button.pressed){ 
      return buttonOrder[idx]
    }
  }).filter((slot)=> slot !== undefined)
}
export default function N64Controller (gamepad) {
  return {
    analog: {
      x: gamepad.axes[1],
      y: gamepad.axes[2]
    },
    dpad:  (dpadMap[gamepad.axes[6]] || 'NONE'),
    buttons: buttonMap(gamepad.buttons)
  }
}