import { IGNORE_KEYS, KEYS, BLINK_CHARACTER, HOST } from "./constants.js";
import { processCommand } from "./commands.js";
import { fileSystem } from "./fs.js";

var isControlPressed = false;
var isMetaPressed = false;
var isAltPressed = false;

document.getElementById("commands").appendChild(createNewCommandInput());

addEventListener("keydown", async (event) => {
  if (IGNORE_KEYS.includes(event.key)) return;

  if (event.key === KEYS.ALT) {
    isAltPressed = true;
    return;
  }

  if (event.key === KEYS.CTRL) {
    isControlPressed = true;
    return;
  }

  if (event.key === KEYS.CMD) {
    isMetaPressed = true;
    return;
  }

  var input = document.getElementsByClassName("input active")[0];
  if (event.key === KEYS.BACKSPACE) {
    if (input.textContent.length > 0) {
      var endIndex = input.textContent.length - 1;
      if (isAltPressed) {
        // We want to delete whole words when alt and backspace are pressed together
        // Find either dot or whitespace and delete content until that character
        // If there is no such character it means that we are left with one word,
        // and the whole content should be deleted
        const lastIndex = Math.max(
          input.textContent.lastIndexOf(" "),
          input.textContent.lastIndexOf(".")
        );
        endIndex = lastIndex !== -1 ? lastIndex : 0;
      }
      input.textContent = input.textContent.slice(0, endIndex);
    }
    return;
  }

  if (isCopy(event)) {
    return;
  }

  if (isPaste(event)) {
    input.textContent += await navigator.clipboard.readText();
    return;
  }

  var commands = document.getElementById("commands");
  if (event.key === "c" && isControlPressed) {
    commitCommand();
    // Creating a new line that will enable you to input new command
    var newCommandInput = createNewCommandInput();

    // Append new command lne to existing commands
    commands.appendChild(newCommandInput);
    scrollToBottom();
    return;
  }

  if (event.key === "k" && isMetaPressed) {
    clearTerminal();
    return;
  }

  if (event.key === KEYS.ENTER) {
    // When enter is pressed, we want to remove blinking char from current line
    // enter to new row with ability to write new command
    var command = commitCommand();

    // Here we need to process command
    // and append row as response
    if (command !== "") {
      var content = processCommand(command);
      if (content) {
        commands.appendChild(content);
      }
    }

    // Creating a new line that will enable you to input new command
    var newCommandInput = createNewCommandInput();

    // Append new command lne to existing commands
    commands.appendChild(newCommandInput);
    scrollToBottom();
    return;
  }

  scrollToBottom();
  input.textContent += event.key;
});

addEventListener("keyup", (event) => {
  // Key releases
  if (event.key === KEYS.CTRL) isControlPressed = false;
  if (event.key === KEYS.CMD) isMetaPressed = false;
  if (event.key === KEYS.ALT) isAltPressed = false;
});

function isPaste(event) {
  return event.key === "v" && isMetaPressed;
}

function isCopy(event) {
  return event.key === "c" && isMetaPressed;
}

function scrollToBottom() {
  var terminalContent = document.getElementById("terminal-content");
  terminalContent.scrollTop = terminalContent.scrollHeight;
}

function clearTerminal() {
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

function createNewCommandInput() {
  var command = document.createElement("li");

  var host = document.createElement("span");
  host.textContent = `${HOST}${fileSystem.currentWorkingDirectory.absolutePath}:`;
  host.className = "host";

  var input = document.createElement("span");
  input.className = "input active";
  input.id = "input";

  var blink = document.createElement("span");
  blink.textContent = BLINK_CHARACTER;
  blink.className = "blink";
  blink.id = "blink";
  // Setting command as active
  // in order to be able to write
  command.className = "command active";

  command.appendChild(host);
  command.appendChild(input);
  command.appendChild(blink);
  return command;
}

function commitCommand() {
  var lastCommand = commands.getElementsByClassName("command active")[0];
  lastCommand.removeChild(document.getElementById("blink"));
  document.getElementsByClassName("input active")[0].className = "input";
  lastCommand.className = "command";
  return lastCommand.textContent
    .trim()
    .split(`${HOST}${fileSystem.currentWorkingDirectory.absolutePath}:`)[1];
}
