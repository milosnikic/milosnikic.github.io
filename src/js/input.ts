import { IGNORE_KEYS, KEYS } from "./constants.js";
import { terminal } from "./terminal.js";
import { createNewCommandInput } from "./utils.js";
import { scrollToBottom, commitCommand, clearTerminal } from "./utils.js";
import { Cursor } from "./cursor.js";

export class InputProcessor {
  isControlPressed: boolean = false;
  isMetaPressed: boolean = false;
  isAltPressed: boolean = false;
  commandsElement: HTMLElement;
  input: null | HTMLSpanElement;
  cursor: Cursor;

  constructor() {
    this.isControlPressed = false;
    this.isMetaPressed = false;
    this.isAltPressed = false;
    this.commandsElement = document.getElementById("commands") as HTMLElement;
    this.commandsElement.appendChild(createNewCommandInput());
    this.addKeydownListener();
    this.addKeyupListener();
    this.input = document.getElementsByClassName(
      "input active"
    )[0] as HTMLSpanElement;
    this.cursor = new Cursor();
  }

  addKeydownListener() {
    addEventListener("keydown", async (event) => this.keyPressed(event));
  }

  addKeyupListener() {
    addEventListener("keyup", (event) => {
      if (event.key === KEYS.CTRL) this.isControlPressed = false;
      if (event.key === KEYS.CMD) this.isMetaPressed = false;
      if (event.key === KEYS.ALT) this.isAltPressed = false;
    });
  }

  async keyPressed(event: KeyboardEvent) {
    if (IGNORE_KEYS.includes(event.key)) return;

    if (event.key === KEYS.ALT) {
      this.isAltPressed = true;
      return;
    }

    if (event.key === KEYS.CTRL) {
      this.isControlPressed = true;
      return;
    }

    if (event.key === KEYS.CMD) {
      this.isMetaPressed = true;
      return;
    }

    this.input = document.getElementsByClassName(
      "input active"
    )[0] as HTMLSpanElement;

    if (event.key === KEYS.BACKSPACE) {
      return this.cursor.delete(this.input, this.isAltPressed);
    }

    if (event.key === KEYS.ARROW_UP) {
      event.preventDefault();
      return this.getPreviousFromHistory();
    }

    if (event.key === KEYS.ARROW_DOWN) {
      event.preventDefault();
      return this.getNextFromHistory();
    }

    if (event.key === KEYS.ARROW_LEFT || event.key === KEYS.ARROW_RIGHT) {
      event.preventDefault();
      return this.cursor.move(
        this.input,
        event.key,
        this.isAltPressed,
        this.isMetaPressed
      );
    }

    if (this.isCopy(event)) {
      return;
    }

    if (this.isPaste(event)) {
      return await this.pasteFromClipboard();
    }

    if (event.key === "c" && this.isControlPressed) {
      commitCommand();
      return this.createNewCommandInput();
    }

    if (event.key === "k" && this.isMetaPressed) {
      return clearTerminal();
    }

    if (event.key === KEYS.ENTER) {
      this.cursor.resetPosition();
      return this.processCommand();
    }

    scrollToBottom();
    this.cursor.addTextContent(this.input, event.key);
  }

  private getPreviousFromHistory() {
    const commandsHistory = terminal.getCommandsHistory();
    if (commandsHistory.length > 0) {
      let previous = commandsHistory.length - 1 - terminal.getHistoryIndex();
      if (previous < 0) {
        return;
      }
      terminal.incrementHistoryIndex();
      this.input!.textContent = commandsHistory[previous];
    }
  }

  private getNextFromHistory() {
    const commandsHistory = terminal.getCommandsHistory();
    if (commandsHistory.length > 0) {
      let next = commandsHistory.length - terminal.historyIndex + 1;
      if (next > commandsHistory.length) {
        return;
      }
      terminal.decrementHistoryIndex();
      this.input!.textContent = commandsHistory[next];
    }
  }

  private isPaste(event: KeyboardEvent) {
    return event.key === "v" && this.isMetaPressed;
  }

  private isCopy(event: KeyboardEvent) {
    return event.key === "c" && this.isMetaPressed;
  }

  private async pasteFromClipboard() {
    this.input!.textContent += await navigator.clipboard.readText();
  }

  private processCommand() {
    var command = commitCommand();

    if (command !== "") {
      var content = terminal.processInput(command);
      if (content) {
        this.commandsElement.appendChild(content);
      }
    }

    this.createNewCommandInput();
  }

  private createNewCommandInput() {
    var newCommandInput = createNewCommandInput();
    this.commandsElement.appendChild(newCommandInput);
    scrollToBottom();
  }
}
