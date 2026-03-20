var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { IGNORE_KEYS, KEYS } from "./constants.js";
import { terminal } from "./terminal.js";
import { createNewCommandInput } from "./utils.js";
import { scrollToBottom, commitCommand, clearTerminal, getAutocomplete, displaySuggestions, removeSuggestions, } from "./utils.js";
import { Cursor } from "./cursor.js";
export class InputProcessor {
    constructor() {
        this.isControlPressed = false;
        this.isMetaPressed = false;
        this.isAltPressed = false;
        this.activeSuggestions = [];
        this.suggestionIndex = -1;
        this.suggestionPrefix = "";
        this.disabled = false;
        this.isControlPressed = false;
        this.isMetaPressed = false;
        this.isAltPressed = false;
        this.commandsElement = document.getElementById("commands");
        this.commandsElement.appendChild(createNewCommandInput());
        this.addKeydownListener();
        this.addKeyupListener();
        this.input = document.getElementsByClassName("input active")[0];
        this.cursor = new Cursor(this.input);
    }
    addKeydownListener() {
        addEventListener("keydown", (event) => __awaiter(this, void 0, void 0, function* () { return this.keyPressed(event); }));
    }
    addKeyupListener() {
        addEventListener("keyup", (event) => {
            if (event.key === KEYS.CTRL)
                this.isControlPressed = false;
            if (event.key === KEYS.CMD)
                this.isMetaPressed = false;
            if (event.key === KEYS.ALT)
                this.isAltPressed = false;
        });
    }
    keyPressed(event) {
        return __awaiter(this, void 0, void 0, function* () {
            if (IGNORE_KEYS.includes(event.key))
                return;
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
            if (this.disabled)
                return;
            this.input = document.getElementsByClassName("input active")[0];
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
                return yield this.cursor.pasteFromClipboard();
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
        });
    }
    isPaste(event) {
        return event.key === "v" && this.isMetaPressed;
    }
    isCopy(event) {
        return event.key === "c" && this.isMetaPressed;
    }
    handleAutocomplete() {
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
        if (!text)
            return;
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
        this.cursor.replaceText(this.suggestionPrefix + this.activeSuggestions[0]);
        displaySuggestions(this.activeSuggestions, this.suggestionIndex);
    }
    resetSuggestions() {
        this.activeSuggestions = [];
        this.suggestionIndex = -1;
        this.suggestionPrefix = "";
        removeSuggestions();
    }
    getCommonPrefix(strings) {
        if (strings.length === 0)
            return "";
        let prefix = strings[0];
        for (let i = 1; i < strings.length; i++) {
            while (!strings[i].startsWith(prefix)) {
                prefix = prefix.slice(0, -1);
            }
        }
        return prefix;
    }
    processCommand() {
        var command = commitCommand();
        if (command !== "") {
            var content = terminal.processInput(command);
            if (content) {
                this.commandsElement.appendChild(content);
            }
        }
        this.createNewCommandInput();
    }
    createNewCommandInput() {
        var newCommandInput = createNewCommandInput();
        this.commandsElement.appendChild(newCommandInput);
        scrollToBottom();
    }
    setDisabled(disabled) {
        this.disabled = disabled;
    }
}
