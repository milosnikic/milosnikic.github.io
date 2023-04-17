import { HOST, BLINK_CHARACTER } from "./constants.js";
import { fileSystem } from "./fs.js";
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
    var blinkSpan = document.createElement("span");
    blinkSpan.textContent = BLINK_CHARACTER;
    blinkSpan.className = "blink";
    blinkSpan.id = "blink";
    // Setting command as active
    // in order to be able to write
    command.className = "command active";
    command.appendChild(hostSpan);
    command.appendChild(inputSpan);
    command.appendChild(blinkSpan);
    return command;
}
export function commitCommand() {
    var commands = document.getElementById("commands");
    var lastCommand = commands.getElementsByClassName("command active")[0];
    var blink = document.getElementById("blink");
    if (blink) {
        lastCommand.removeChild(blink);
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
