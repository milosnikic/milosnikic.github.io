const KEYS = {
  ALT: "Alt",
  CTRL: "Control",
  SHIFT: "Shift",
  CAPS_LOCK: "CapsLock",
  CMD: "Meta",
  ENTER: "Enter",
  ESC: "Escape",
  BACKSPACE: "Backspace",
};
const IGNORE_KEYS = [KEYS.CTRL, KEYS.SHIFT, KEYS.ESC, KEYS.CAPS_LOCK];

const BLINK_CHARACTER = "▉";
const HOST = "milos.nikic@localhost";

export { IGNORE_KEYS, KEYS, BLINK_CHARACTER, HOST };
