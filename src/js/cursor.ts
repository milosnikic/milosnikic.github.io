import { KEYS } from "./constants.js";
import { createCursorSpan } from "./utils.js";
import { terminal } from "./terminal.js";

export class Cursor {
  position: number;
  element: HTMLSpanElement;
  input: null | HTMLSpanElement;

  constructor(input: null | HTMLSpanElement) {
    this.position = 0;
    this.element = document.getElementById("cursor") as HTMLSpanElement;
    this.input = input;
  }

  private remove() {
    document.getElementById("cursor")!.remove();
  }

  private place() {
    let content = this.input?.textContent;
    this.element = createCursorSpan();
    this.input!.innerHTML =
      content?.slice(0, this.position) +
      this.element.outerHTML +
      content?.slice(this.position);
  }

  setInput(input: null | HTMLSpanElement) {
    this.input = input;
  }

  resetPosition() {
    this.position = 0;
  }

  setPosition(position: number) {
    if (position == 0) {
      this.resetPosition();
      return;
    }
    if (position > 0 && position <= this.input!.textContent!.length) {
      this.position = position;
    }
  }

  addTextContent(textContent: string) {
    this.remove();
    let content = this.input!.textContent;
    this.input!.textContent =
      content!.slice(0, this.position) +
      textContent +
      content!.slice(this.position);
    this.position++;
    this.place();
  }

  getText(): string {
    return this.input!.textContent!.slice(
      0,
      this.input!.textContent!.length - 1
    );
  }

  move(key: string, isAltPressed: boolean, isMetaPressed: boolean) {
    if (!this.input?.textContent || !this.input.textContent.length) {
      return;
    }
    if (key === KEYS.ARROW_LEFT && this.position > 0) {
      this.remove();
      if (isAltPressed) {
        this.setPosition(
          this.getAltIndexLeftFromCursor(this.input?.textContent)
        );
      } else if (isMetaPressed) {
        this.resetPosition();
      } else {
        this.setPosition(this.position - 1);
      }
      this.place();
    }

    if (
      key === KEYS.ARROW_RIGHT &&
      this.position < this.input.textContent.length - 1 // here we are subtracting 1 because of cursor character
    ) {
      this.remove();
      if (isAltPressed) {
        this.setPosition(
          this.getAltIndexRightFromCursor(this.input?.textContent)
        );
      } else if (isMetaPressed) {
        this.setPosition(this.input.textContent.length);
      } else {
        this.setPosition(this.position + 1);
      }
      this.place();
    }
  }

  delete(isAltPressed: boolean) {
    this.remove();
    let content = this.input!.textContent;
    if (content!.length > 0 && this.position > 0) {
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

        let contentBeforeCursor = content!.slice(0, this.position);
        let contentAfterCursor = content!.slice(this.position);
        let deleteIndex = this.getAltIndexLeftFromCursor(contentBeforeCursor);

        contentBeforeCursor = contentBeforeCursor.slice(0, deleteIndex);
        this.input!.textContent = contentBeforeCursor + contentAfterCursor;
        this.setPosition(deleteIndex);
      } else {
        this.input!.textContent =
          content!.slice(0, this.position - 1) + content!.slice(this.position);
        this.position--;
      }
    }
    this.place();
  }

  private getAltIndexLeftFromCursor(content: string) {
    content = content.slice(0, this.position);
    let index = Math.max(content!.lastIndexOf(" "), content!.lastIndexOf("."));
    return index !== -1 ? index : 0;
  }

  private getAltIndexRightFromCursor(content: string) {
    let index = this.position;
    for (; index < content.length; index++) {
      if (index === content.length - 1) {
        return index + 1;
      }
      const element = content[index];
      const next = content[index + 1];
      if (
        (element === " " || element === ".") &&
        next !== " " &&
        next !== "."
      ) {
        return index + 1;
      }
    }

    return index;
  }

  getPreviousFromHistory() {
    const command = terminal.getPreviousCommand();
    this.remove();
    this.input!.textContent = command;
    this.position += command.length;
    this.place();
  }

  getNextFromHistory() {
    const command = terminal.getNextCommand();
    this.remove();
    this.position += command.length;
    this.input!.textContent = command;
    this.place();
  }

  async pasteFromClipboard() {
    const pastedText = await navigator.clipboard.readText();

    this.remove();
    this.input!.textContent += pastedText;
    this.position += pastedText.length;
    this.place();
  }

  replaceText(text: string) {
    this.remove();
    this.input!.textContent = text;
    this.position = text.length;
    this.place();
  }
}
