var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { KEYS } from "./constants.js";
import { createCursorSpan } from "./utils.js";
import { terminal } from "./terminal.js";
export class Cursor {
    constructor(input) {
        this.position = 0;
        this.element = document.getElementById("cursor");
        this.input = input;
    }
    remove() {
        document.getElementById("cursor").remove();
    }
    place() {
        var _a;
        let content = (_a = this.input) === null || _a === void 0 ? void 0 : _a.textContent;
        this.element = createCursorSpan();
        this.input.innerHTML =
            (content === null || content === void 0 ? void 0 : content.slice(0, this.position)) +
                this.element.outerHTML +
                (content === null || content === void 0 ? void 0 : content.slice(this.position));
    }
    setInput(input) {
        this.input = input;
    }
    resetPosition() {
        this.position = 0;
    }
    setPosition(position) {
        if (position == 0) {
            this.resetPosition();
            return;
        }
        if (position > 0 && position <= this.input.textContent.length) {
            this.position = position;
        }
    }
    addTextContent(textContent) {
        this.remove();
        let content = this.input.textContent;
        this.input.textContent =
            content.slice(0, this.position) +
                textContent +
                content.slice(this.position);
        this.position++;
        this.place();
    }
    getText() {
        return this.input.textContent.slice(0, this.input.textContent.length - 1);
    }
    move(key, isAltPressed, isMetaPressed) {
        var _a, _b, _c;
        if (!((_a = this.input) === null || _a === void 0 ? void 0 : _a.textContent) || !this.input.textContent.length) {
            return;
        }
        if (key === KEYS.ARROW_LEFT && this.position > 0) {
            this.remove();
            if (isAltPressed) {
                this.setPosition(this.getAltIndexLeftFromCursor((_b = this.input) === null || _b === void 0 ? void 0 : _b.textContent));
            }
            else if (isMetaPressed) {
                this.resetPosition();
            }
            else {
                this.setPosition(this.position - 1);
            }
            this.place();
        }
        if (key === KEYS.ARROW_RIGHT &&
            this.position < this.input.textContent.length - 1 // here we are subtracting 1 because of cursor character
        ) {
            this.remove();
            if (isAltPressed) {
                this.setPosition(this.getAltIndexRightFromCursor((_c = this.input) === null || _c === void 0 ? void 0 : _c.textContent));
            }
            else if (isMetaPressed) {
                this.setPosition(this.input.textContent.length);
            }
            else {
                this.setPosition(this.position + 1);
            }
            this.place();
        }
    }
    delete(isAltPressed) {
        this.remove();
        let content = this.input.textContent;
        if (content.length > 0 && this.position > 0) {
            if (isAltPressed) {
                // Here we should search left side of cursor
                // and then find the index
                // We need to save both parts of command
                // after cursor and before cursor.
                // After that, find first " " or "." before cursor
                // and slice command to delete that part in between.
                // After that we just need to concatenate both parts
                // before and after cursor (Before cursor command part
                // is adjusted with slice) and to update cursor position
                // to the index of " " or ".".
                // e.g.
                //              12    18
                //              |     |
                //             \ /   \ /
                //  this is text needs▉ to be deleted
                //            = >
                //  this is text to be deleted
                //
                let contentBeforeCursor = content.slice(0, this.position);
                let contentAfterCursor = content.slice(this.position);
                let deleteIndex = this.getAltIndexLeftFromCursor(contentBeforeCursor);
                contentBeforeCursor = contentBeforeCursor.slice(0, deleteIndex);
                this.input.textContent = contentBeforeCursor + contentAfterCursor;
                this.setPosition(deleteIndex);
            }
            else {
                this.input.textContent =
                    content.slice(0, this.position - 1) + content.slice(this.position);
                this.position--;
            }
        }
        this.place();
    }
    getAltIndexLeftFromCursor(content) {
        content = content.slice(0, this.position);
        let index = Math.max(content.lastIndexOf(" "), content.lastIndexOf("."));
        return index !== -1 ? index : 0;
    }
    getAltIndexRightFromCursor(content) {
        let index = this.position;
        for (; index < content.length; index++) {
            if (index === content.length - 1) {
                return index + 1;
            }
            const element = content[index];
            const next = content[index + 1];
            if ((element === " " || element === ".") &&
                next !== " " &&
                next !== ".") {
                return index + 1;
            }
        }
        return index;
    }
    getPreviousFromHistory() {
        const command = terminal.getPreviousCommand();
        this.remove();
        this.input.textContent = command;
        this.position += command.length;
        this.place();
    }
    getNextFromHistory() {
        const command = terminal.getNextCommand();
        this.remove();
        this.position += command.length;
        this.input.textContent = command;
        this.place();
    }
    pasteFromClipboard() {
        return __awaiter(this, void 0, void 0, function* () {
            const pastedText = yield navigator.clipboard.readText();
            this.remove();
            this.input.textContent += pastedText;
            this.position += pastedText.length;
            this.place();
        });
    }
    replaceText(text) {
        this.remove();
        this.input.textContent = text;
        this.position = text.length;
        this.place();
    }
}
