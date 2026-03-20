import {
  HOST,
  CURSOR_CHARACTER as CURSOR_CHARACTER,
  COMMANDS,
} from "./constants.js";
import { fileSystem } from "./fs.js";
import { terminal } from "./terminal.js";

export function distance(x: number, y: number, collX: number, collY: number) {
  return Math.sqrt(
    Math.pow(Math.abs(collX - x), 2) + Math.pow(Math.abs(collY - y), 2)
  );
}

export class Drop {
  color: string;
  speed: number;
  fontSize: number;
  text: string;
  y: number;
  x: number;

  constructor(
    color: string,
    speed: number,
    fontSize: number,
    text: string,
    y: number,
    x: number
  ) {
    this.color = color;
    this.speed = speed;
    this.fontSize = fontSize;
    this.text = text;
    this.y = y;
    this.x = x;
  }
}

export function createDrops(canvas: HTMLCanvasElement) {
  var drops: Drop[] = [];
  const numberOfDrops = Math.floor(canvas.width / 8);
  for (let i = 0; i < numberOfDrops; i++) {
    drops[i] = new Drop(
      `rgba(${Math.floor(Math.random() * 100)}, ${Math.floor(
        Math.random() * 255
      )}, ${Math.floor(Math.random() * 50)}, ${Math.random()})`,
      Math.floor(Math.random() * 2) + 1,
      Math.floor(Math.random() * 80) + 1,
      String.fromCharCode(Math.floor(Math.random() * 96) + 32),
      Math.floor(Math.random() * canvas.height),
      Math.floor(Math.random() * canvas.width)
    );
  }

  return drops;
}

export function scrollToBottom() {
  var terminalContent = document.getElementById("terminal-content");
  terminalContent!.scrollTop = terminalContent!.scrollHeight;
}

export function clearTerminal() {
  var commands = document.getElementById("commands");
  var listOfCommands = commands!.getElementsByClassName("command");
  for (let index = 0; index < listOfCommands.length; index++) {
    const element = listOfCommands[index];
    if (element.className.indexOf("active") !== -1) {
      commands!.innerHTML = "";
      commands!.appendChild(element);
      return;
    }
  }
}

export function createNewCommandInput() {
  var command: HTMLLIElement = document.createElement("li");

  var hostSpan: HTMLSpanElement = document.createElement("span");
  hostSpan!.textContent = `${HOST}${fileSystem.currentWorkingDirectory.absolutePath}:`;
  hostSpan!.className = "host";

  var inputSpan: HTMLSpanElement = document.createElement("span");
  inputSpan.className = "input active";
  inputSpan.id = "input";

  var cursorSpan: HTMLSpanElement = createCursorSpan();
  // Setting command as active
  // in order to be able to write
  command.className = "command active";

  command.appendChild(hostSpan);
  inputSpan.appendChild(cursorSpan);
  command.appendChild(inputSpan);
  return command;
}

export function commitCommand() {
  var commands: null | HTMLElement = document.getElementById("commands");
  var lastCommand = commands!.getElementsByClassName("command active")[0];
  var input: HTMLSpanElement = document.getElementsByClassName(
    "input active"
  )[0] as HTMLSpanElement;
  var cursor = document.getElementById("cursor");
  if (cursor) {
    input.removeChild(cursor);
  }
  document.getElementsByClassName("input active")[0].classList.remove("active");
  lastCommand.classList.remove("active");
  return lastCommand
    .textContent!.trim()
    .split(`${HOST}${fileSystem.currentWorkingDirectory.absolutePath}:`)[1]
    .trim();
}

export function createNewResultLine(content: string | null) {
  var line = document.createElement("li");
  line.className = "result";
  line.innerHTML = content || "";
  return line;
}

export function changeTheme() {
  let navbar = document.getElementById("navbar");
  navbar!.classList.toggle("navbar-light-theme");

  let heading = document.getElementById("heading");
  heading!.classList.toggle("light-theme");

  let footer = document.getElementById("footer");
  footer!.classList.toggle("footer-light-theme");

  let rightsText = document.getElementById("credits-text");
  rightsText!.classList.toggle("credits-text-light-theme");

  let modeIcons = document.getElementsByClassName("mode-icon");
  for (let i = 0; i < modeIcons.length; i++) {
    modeIcons[i].classList.toggle("light-theme");
  }

  let toggleDivider = document.querySelector(".toggle-divider");
  if (toggleDivider) {
    toggleDivider.classList.toggle("light-theme");
  }

  let socialIcons = document.getElementsByClassName("social-icon");
  const darkTheme: boolean = terminal.isDarkTheme();
  for (const index in socialIcons) {
    if (Object.hasOwnProperty.call(socialIcons, index)) {
      const element: Element = socialIcons[index];
      const icon = element as HTMLImageElement;
      icon.src = icon!.src.replace(
        darkTheme ? "white" : "black",
        darkTheme ? "black" : "white"
      );
    }
  }

  const element: HTMLElement | null = document.getElementById("theme-toggle");
  const themeToggle = element as HTMLInputElement;
  themeToggle.checked = darkTheme;
  terminal.setIsDarkTheme(!darkTheme);
}

export function createCursorSpan(): HTMLSpanElement {
  var cursorSpan: HTMLSpanElement = document.createElement("span");
  cursorSpan.textContent = CURSOR_CHARACTER;
  cursorSpan.className = "blink";
  cursorSpan.id = "cursor";
  return cursorSpan;
}

export interface AutocompleteResult {
  suggestions: string[];
  prefix: string;
  suffix: string;
}

export function getAutocomplete(text: string): AutocompleteResult {
  const spaceIndex = text.indexOf(" ");

  if (spaceIndex === -1) {
    // No space — autocomplete commands
    const suggestions: string[] = [];
    for (const command of Object.keys(COMMANDS)) {
      if (command.startsWith(text) && command !== text) {
        suggestions.push(command);
      }
    }
    return { suggestions, prefix: "", suffix: "" };
  }

  // Has space — autocomplete filesystem paths (argument)
  const commandPart = text.slice(0, spaceIndex + 1);
  const argPart = text.slice(spaceIndex + 1);
  const directoryContent = fileSystem.listCurrentWorkingDirectory();
  const suggestions: string[] = [];

  for (const node of directoryContent) {
    if (node.name.startsWith(argPart) && node.name !== argPart) {
      suggestions.push(node.name);
    }
  }

  return { suggestions, prefix: commandPart, suffix: "" };
}

export function displaySuggestions(suggestions: string[], activeIndex: number = -1) {
  const commands = document.getElementById("commands");
  if (!commands) return;

  removeSuggestions();

  const line = document.createElement("li");
  line.className = "result autocomplete-suggestions";
  line.innerHTML = suggestions
    .map(
      (s, i) =>
        `<span class="suggestion-item${i === activeIndex ? " suggestion-active" : ""}"><span class="suggestion-text">${s}</span></span>`
    )
    .join("");
  commands.appendChild(line);
  scrollToBottom();
}

export function removeSuggestions() {
  const existing = document.querySelectorAll(".autocomplete-suggestions");
  existing.forEach((el) => el.remove());
}
