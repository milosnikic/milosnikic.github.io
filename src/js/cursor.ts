import { KEYS } from "./constants.js";
import { createCursorSpan } from "./utils.js";

export class Cursor {
  position: number;
  element: HTMLSpanElement;

  constructor() {
    this.position = 0;
    this.element = document.getElementById("cursor") as HTMLSpanElement;
  }

  private remove() {
    document.getElementById("cursor")!.remove();
  }

  private place(input: null | HTMLSpanElement) {
    let content = input?.textContent;
    this.element = createCursorSpan();
    input!.innerHTML =
      content?.slice(0, this.position) +
      this.element.outerHTML +
      content?.slice(this.position);
  }

  resetPosition() {
    this.position = 0;
  }

  setPosition(position: number, input: null | HTMLSpanElement) {
    if (position == 0) {
      this.resetPosition();
      return;
    }
    if (position > 0 && position <= input!.textContent!.length) {
      this.position = position;
    }
  }

  addTextContent(input: null | HTMLSpanElement, textContent: string) {
    this.remove();
    let content = input!.textContent;
    input!.textContent =
      content!.slice(0, this.position) +
      textContent +
      content!.slice(this.position);
    this.position++;
    this.place(input);
  }

  move(
    input: null | HTMLSpanElement,
    key: string,
    isAltPressed: boolean,
    isMetaPressed: boolean
  ) {
    if (!input?.textContent || !input.textContent.length) {
      return;
    }
    if (key === KEYS.ARROW_LEFT && this.position > 0) {
      this.remove();
      if (isAltPressed) {
        this.setPosition(
          this.getAltIndexLeftFromCursor(input?.textContent),
          input
        );
      } else if (isMetaPressed) {
        this.resetPosition();
      } else {
        this.setPosition(this.position - 1, input);
      }
      this.place(input);
    }

    if (
      key === KEYS.ARROW_RIGHT &&
      this.position < input.textContent.length - 1 // here we are subtracting 1 because of cursor character
    ) {
      this.remove();
      if (isAltPressed) {
        this.setPosition(
          this.getAltIndexRightFromCursor(input?.textContent),
          input
        );
      } else if (isMetaPressed) {
        this.setPosition(input.textContent.length, input);
      } else {
        this.setPosition(this.position + 1, input);
      }
      this.place(input);
    }
  }

  delete(input: null | HTMLSpanElement, isAltPressed: boolean) {
    this.remove();
    let content = input!.textContent;
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
        input!.textContent = contentBeforeCursor + contentAfterCursor;
        this.setPosition(deleteIndex, input);
      } else {
        input!.textContent =
          content!.slice(0, this.position - 1) + content!.slice(this.position);
        this.position--;
      }
    }
    this.place(input);
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
}
