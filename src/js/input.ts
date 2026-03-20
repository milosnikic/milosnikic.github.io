import { IGNORE_KEYS, KEYS } from "./constants.js";
import { terminal } from "./terminal.js";
import { createNewCommandInput } from "./utils.js";
import {
  scrollToBottom,
  commitCommand,
  clearTerminal,
  getAutocomplete,
  displaySuggestions,
  removeSuggestions,
} from "./utils.js";
import { Cursor } from "./cursor.js";

export class InputProcessor {
  isControlPressed: boolean = false;
  isMetaPressed: boolean = false;
  isAltPressed: boolean = false;
  commandsElement: HTMLElement;
  input: null | HTMLSpanElement;
  cursor: Cursor;
  activeSuggestions: string[] = [];
  suggestionIndex: number = -1;
  suggestionPrefix: string = "";

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
    this.cursor = new Cursor(this.input);
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
    this.cursor.setInput(this.input);

    if (event.key !== KEYS.TAB) {
      this.resetSuggestions();
    }

    if (event.key === KEYS.TAB) {
      event.preventDefault();
      this.handleAutocomplete();
      return;
    }

    if (event.key === KEYS.BACKSPACE) {
      return this.cursor.delete(this.isAltPressed);
    }

    if (event.key === KEYS.ARROW_UP) {
      event.preventDefault();
      return this.cursor.getPreviousFromHistory();
    }

    if (event.key === KEYS.ARROW_DOWN) {
      event.preventDefault();
      return this.cursor.getNextFromHistory();
    }

    if (event.key === KEYS.ARROW_LEFT || event.key === KEYS.ARROW_RIGHT) {
      event.preventDefault();
      return this.cursor.move(event.key, this.isAltPressed, this.isMetaPressed);
    }

    if (this.isCopy(event)) {
      return;
    }

    if (this.isPaste(event)) {
      return await this.cursor.pasteFromClipboard();
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
    this.cursor.addTextContent(event.key);
  }

  private isPaste(event: KeyboardEvent) {
    return event.key === "v" && this.isMetaPressed;
  }

  private isCopy(event: KeyboardEvent) {
    return event.key === "c" && this.isMetaPressed;
  }

  private handleAutocomplete() {
    // If we're already cycling through suggestions, advance to next
    if (this.activeSuggestions.length > 0) {
      this.suggestionIndex =
        (this.suggestionIndex + 1) % this.activeSuggestions.length;
      const selected = this.activeSuggestions[this.suggestionIndex];
      this.cursor.replaceText(this.suggestionPrefix + selected);
      displaySuggestions(this.activeSuggestions, this.suggestionIndex);
      return;
    }

    const text = this.cursor.getText();
    if (!text) return;

    const result = getAutocomplete(text);
    if (result.suggestions.length === 0) {
      removeSuggestions();
      return;
    }

    if (result.suggestions.length === 1) {
      removeSuggestions();
      const completed = result.prefix + result.suggestions[0];
      this.cursor.replaceText(completed);
      return;
    }

    // Multiple matches — start cycling
    this.activeSuggestions = result.suggestions;
    this.suggestionPrefix = result.prefix;
    this.suggestionIndex = 0;
    this.cursor.replaceText(
      this.suggestionPrefix + this.activeSuggestions[0]
    );
    displaySuggestions(this.activeSuggestions, this.suggestionIndex);
  }

  private resetSuggestions() {
    this.activeSuggestions = [];
    this.suggestionIndex = -1;
    this.suggestionPrefix = "";
    removeSuggestions();
  }

  private getCommonPrefix(strings: string[]): string {
    if (strings.length === 0) return "";
    let prefix = strings[0];
    for (let i = 1; i < strings.length; i++) {
      while (!strings[i].startsWith(prefix)) {
        prefix = prefix.slice(0, -1);
      }
    }
    return prefix;
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
