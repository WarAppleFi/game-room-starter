// Movement input.
//
//   - Keyboard (WASD / arrows): emits a movement vector in the
//     player's local forward/strafe axes.
//   - Mouse: controls the camera yaw/pitch while the pointer is locked
//     over the canvas, which gives the scene a first-person feel.

export interface InputState {
  dx: number;
  dy: number;
  lookX: number;
  lookY: number;
}

export function createInput(canvas: HTMLElement) {
  const ret = {
    state: { dx: 0, dy: 0, lookX: 0, lookY: 0 } as InputState,
    pointerScreen: null as { x: number; y: number } | null,
    setEnabled(b: boolean) { enabled = b; if (!b) reset(); },
  };

  const keys = new Set<string>();
  let enabled = true;
  let pointerLocked = false;

  function reset() {
    keys.clear();
    ret.state.dx = 0;
    ret.state.dy = 0;
    ret.state.lookX = 0;
    ret.state.lookY = 0;
    ret.pointerScreen = null;
    pointerLocked = false;
  }

  function recomputeKeyboard() {
    let x = 0;
    let y = 0;
    if (keys.has("KeyW") || keys.has("ArrowUp")) y += 1;
    if (keys.has("KeyS") || keys.has("ArrowDown")) y -= 1;
    if (keys.has("KeyA") || keys.has("ArrowLeft")) x -= 1;
    if (keys.has("KeyD") || keys.has("ArrowRight")) x += 1;
    ret.state.dx = x;
    ret.state.dy = y;
  }

  window.addEventListener("keydown", (e) => {
    if (!enabled) return;
    if (e.target instanceof HTMLInputElement) return;
    keys.add(e.code);
    recomputeKeyboard();
  });
  window.addEventListener("keyup", (e) => {
    keys.delete(e.code);
    recomputeKeyboard();
  });

  canvas.addEventListener("click", () => {
    if (!enabled) return;
    canvas.requestPointerLock();
  });

  document.addEventListener("pointerlockchange", () => {
    pointerLocked = document.pointerLockElement === canvas;
  });

  document.addEventListener("mousemove", (e) => {
    if (!enabled || !pointerLocked) return;
    ret.state.lookX += e.movementX;
    ret.state.lookY += e.movementY;
  });

  return ret;
}
