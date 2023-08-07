import { HOST, CURSOR_CHARACTER as CURSOR_CHARACTER } from "./constants.js";
import { fileSystem } from "./fs.js";
import { terminal } from "./terminal.js";
export function distance(x, y, collX, collY) {
    return Math.sqrt(Math.pow(Math.abs(collX - x), 2) + Math.pow(Math.abs(collY - y), 2));
}
export class Drop {
    constructor(color, speed, fontSize, text, y, x) {
        this.color = color;
        this.speed = speed;
        this.fontSize = fontSize;
        this.text = text;
        this.y = y;
        this.x = x;
    }
}
export function createDrops(canvas) {
    var drops = [];
    const numberOfDrops = Math.floor(canvas.width / 8);
    for (let i = 0; i < numberOfDrops; i++) {
        drops[i] = new Drop(`rgba(${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 50)}, ${Math.random()})`, Math.floor(Math.random() * 2) + 1, Math.floor(Math.random() * 80) + 1, String.fromCharCode(Math.floor(Math.random() * 96) + 32), Math.floor(Math.random() * canvas.height), Math.floor(Math.random() * canvas.width));
    }
    return drops;
}
export function scrollToBottom() {
    var terminalContent = document.getElementById("terminal-content");
    terminalContent.scrollTop = terminalContent.scrollHeight;
}
export function clearTerminal() {
    var commands = document.getElementById("commands");
    var listOfCommands = commands.getElementsByClassName("command");
    for (let index = 0; index < listOfCommands.length; index++) {
        const element = listOfCommands[index];
        if (element.className.indexOf("active") !== -1) {
            commands.innerHTML = "";
            commands.appendChild(element);
            return;
        }
    }
}
export function createNewCommandInput() {
    var command = document.createElement("li");
    var hostSpan = document.createElement("span");
    hostSpan.textContent = `${HOST}${fileSystem.currentWorkingDirectory.absolutePath}:`;
    hostSpan.className = "host";
    var inputSpan = document.createElement("span");
    inputSpan.className = "input active";
    inputSpan.id = "input";
    var cursorSpan = createCursorSpan();
    // Setting command as active
    // in order to be able to write
    command.className = "command active";
    command.appendChild(hostSpan);
    inputSpan.appendChild(cursorSpan);
    command.appendChild(inputSpan);
    return command;
}
export function commitCommand() {
    var commands = document.getElementById("commands");
    var lastCommand = commands.getElementsByClassName("command active")[0];
    var input = document.getElementsByClassName("input active")[0];
    var cursor = document.getElementById("cursor");
    if (cursor) {
        input.removeChild(cursor);
    }
    document.getElementsByClassName("input active")[0].classList.remove("active");
    lastCommand.classList.remove("active");
    return lastCommand
        .textContent.trim()
        .split(`${HOST}${fileSystem.currentWorkingDirectory.absolutePath}:`)[1]
        .trim();
}
export function createNewResultLine(content) {
    var line = document.createElement("li");
    line.className = "result";
    line.innerHTML = content || "";
    return line;
}
export function changeTheme() {
    let navbar = document.getElementById("navbar");
    navbar.classList.toggle("navbar-light-theme");
    let heading = document.getElementById("heading");
    heading.classList.toggle("light-theme");
    let footer = document.getElementById("footer");
    footer.classList.toggle("footer-light-theme");
    let socialIcons = document.getElementsByClassName("social-icon");
    const darkTheme = terminal.isDarkTheme();
    for (const index in socialIcons) {
        if (Object.hasOwnProperty.call(socialIcons, index)) {
            const element = socialIcons[index];
            const icon = element;
            icon.src = icon.src.replace(darkTheme ? "white" : "black", darkTheme ? "black" : "white");
        }
    }
    const element = document.getElementById("theme-toggle");
    const themeToggle = element;
    themeToggle.checked = darkTheme;
    terminal.setIsDarkTheme(!darkTheme);
}
export function createCursorSpan() {
    var cursorSpan = document.createElement("span");
    cursorSpan.textContent = CURSOR_CHARACTER;
    cursorSpan.className = "blink";
    cursorSpan.id = "cursor";
    return cursorSpan;
}
