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
import { Terminal } from "./terminal.js";
import { createNewCommandInput } from "./utils.js";
import { scrollToBottom, commitCommand, clearTerminal } from "./utils.js";
export class InputProcessor {
    constructor() {
        this.isControlPressed = false;
        this.isMetaPressed = false;
        this.isAltPressed = false;
        this.isControlPressed = false;
        this.isMetaPressed = false;
        this.isAltPressed = false;
        this.commandsElement = document.getElementById("commands");
        this.commandsElement.appendChild(createNewCommandInput());
        this.terminal = new Terminal([], 0, true);
        this.addKeydownListener();
        this.addKeyupListener();
        this.input = null;
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
            this.input = document.getElementsByClassName("input active")[0];
            if (event.key === KEYS.BACKSPACE) {
                return this.handleDelete();
            }
            if (event.key === KEYS.ARROW_UP) {
                event.preventDefault();
                return this.getPreviousFromHistory();
            }
            if (event.key === KEYS.ARROW_DOWN) {
                event.preventDefault();
                return this.getNextFromHistory();
            }
            if (this.isCopy(event)) {
                return;
            }
            if (this.isPaste(event)) {
                return yield this.pasteFromClipboard();
            }
            if (event.key === "c" && this.isControlPressed) {
                commitCommand();
                return this.createNewCommandInput();
            }
            if (event.key === "k" && this.isMetaPressed) {
                return clearTerminal();
            }
            if (event.key === KEYS.ENTER) {
                return this.processCommand();
            }
            scrollToBottom();
            this.input.textContent += event.key;
        });
    }
    handleDelete() {
        if (this.input.textContent.length > 0) {
            var endIndex = this.input.textContent.length - 1;
            if (this.isAltPressed) {
                const lastIndex = Math.max(this.input.textContent.lastIndexOf(" "), this.input.textContent.lastIndexOf("."));
                endIndex = lastIndex !== -1 ? lastIndex : 0;
            }
            this.input.textContent = this.input.textContent.slice(0, endIndex);
        }
    }
    getPreviousFromHistory() {
        const commandsHistory = Terminal.getCommandsHistory();
        if (commandsHistory.length > 0) {
            let previous = commandsHistory.length - 1 - this.terminal.getHistoryIndex();
            if (previous < 0) {
                return;
            }
            this.terminal.incrementHistoryIndex();
            this.input.textContent = commandsHistory[previous];
        }
    }
    getNextFromHistory() {
        const commandsHistory = Terminal.getCommandsHistory();
        if (commandsHistory.length > 0) {
            let next = commandsHistory.length - this.terminal.historyIndex + 1;
            if (next > commandsHistory.length) {
                return;
            }
            this.terminal.decrementHistoryIndex();
            this.input.textContent = commandsHistory[next];
        }
    }
    isPaste(event) {
        return event.key === "v" && this.isMetaPressed;
    }
    isCopy(event) {
        return event.key === "c" && this.isMetaPressed;
    }
    pasteFromClipboard() {
        return __awaiter(this, void 0, void 0, function* () {
            this.input.textContent += yield navigator.clipboard.readText();
        });
    }
    processCommand() {
        var command = commitCommand();
        if (command !== "") {
            var content = this.terminal.processInput(command);
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
}
