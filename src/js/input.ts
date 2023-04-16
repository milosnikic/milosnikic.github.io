import { IGNORE_KEYS, KEYS } from "./constants.js";
import { Terminal } from "./terminal.js";
import { createNewCommandInput } from "./utils.js";
import { scrollToBottom, commitCommand, clearTerminal } from "./utils.js";

export class InputProcessor {
  isControlPressed: boolean = false;
  isMetaPressed: boolean = false;
  isAltPressed: boolean = false;
  commandsElement: HTMLElement;
  terminal: Terminal;

  constructor() {
    this.isControlPressed = false;
    this.isMetaPressed = false;
    this.isAltPressed = false;
    this.commandsElement = document.getElementById("commands") as HTMLElement;
    this.commandsElement.appendChild(createNewCommandInput());
    this.terminal = new Terminal([], 0, true);
    this.addKeydownListener();
    this.addKeyupListener();
  }

  addKeydownListener() {
    addEventListener("keydown", async (event) => this.keyPressed(event));
  }

  addKeyupListener() {
    addEventListener("keyup", (event) => {
      // Key releases
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

    var input = document.getElementsByClassName(
      "input active"
    )[0] as HTMLLIElement;
    if (event.key === KEYS.BACKSPACE) {
      if (input.textContent!.length > 0) {
        var endIndex = input.textContent!.length - 1;
        if (this.isAltPressed) {
          // We want to delete whole words when alt and backspace are pressed together
          // Find either dot or whitespace and delete content until that character
          // If there is no such character it means that we are left with one word,
          // and the whole content should be deleted
          const lastIndex = Math.max(
            input.textContent!.lastIndexOf(" "),
            input.textContent!.lastIndexOf(".")
          );
          endIndex = lastIndex !== -1 ? lastIndex : 0;
        }
        input.textContent = input.textContent!.slice(0, endIndex);
      }
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (Terminal.getCommandsHistory().length > 0) {
        let previous =
          Terminal.getCommandsHistory().length -
          1 -
          this.terminal.getHistoryIndex();
        if (previous < 0) {
          return;
        }
        this.terminal.incrementHistoryIndex();
        input.textContent = Terminal.getCommandsHistory()[previous];
        return;
      }
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (Terminal.getCommandsHistory().length > 0) {
        let next =
          Terminal.getCommandsHistory().length - this.terminal.historyIndex + 1;
        if (next > Terminal.getCommandsHistory().length) {
          return;
        }
        this.terminal.decrementHistoryIndex();
        input.textContent = Terminal.getCommandsHistory()[next];
        return;
      }
    }

    if (this.isCopy(event)) {
      return;
    }

    if (this.isPaste(event)) {
      input.textContent += await navigator.clipboard.readText();
      return;
    }

    if (event.key === "c" && this.isControlPressed) {
      commitCommand();
      // Creating a new line that will enable you to input new command
      var newCommandInput = createNewCommandInput();

      // Append new command lne to existing commands
      this.commandsElement.appendChild(newCommandInput);
      scrollToBottom();
      return;
    }

    if (event.key === "k" && this.isMetaPressed) {
      clearTerminal();
      return;
    }

    if (event.key === KEYS.ENTER) {
      // When enter is pressed, we want to remove blinking char from current line
      // enter to new row with ability to write new command
      var command = commitCommand();

      // Here we need to process input
      // and append row as response
      if (command !== "") {
        var content = this.terminal.processInput(command);
        if (content) {
          this.commandsElement.appendChild(content);
        }
      }

      // Creating a new line that will enable you to input new command
      var newCommandInput = createNewCommandInput();

      // Append new command lne to existing commands
      this.commandsElement.appendChild(newCommandInput);
      scrollToBottom();
      return;
    }

    scrollToBottom();
    input.textContent += event.key;
  }

  isPaste(event: KeyboardEvent) {
    return event.key === "v" && this.isMetaPressed;
  }

  isCopy(event: KeyboardEvent) {
    return event.key === "c" && this.isMetaPressed;
  }
}
