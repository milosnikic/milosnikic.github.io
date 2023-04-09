import { fileSystem } from "./fs.js";

var commandsHistory = [];
var historyIndex = 0;

function processCommand(cmd) {
  commandsHistory.push(cmd);
  historyIndex = 0;
  const { command, args } = validateCommand(cmd);
  switch (command) {
    case "ls":
      return ls(args);
    case "cd":
      return cd(args);
    case "pwd":
      return pwd();
    case "clear":
      return clear();
    case "cat":
      return cat(args);
    case "help":
      return help();
    case "history":
      return history();
    default:
      return createNewResultLine(
        `Command not found: "${command}". Type "help" for more information.`
      );
  }
}

function validateCommand(cmd) {
  const spaceIndex = cmd.indexOf(" ");
  if (spaceIndex === -1) {
    return { command: cmd };
  }
  const command = cmd.slice(0, spaceIndex).trim();
  const args = cmd.slice(spaceIndex, cmd.length).trim();
  return { command, args };
}

function ls(args) {
  var content = createNewResultLine("");
  for (
    let index = 0;
    index < fileSystem.currentWorkingDirectory.children.length;
    index++
  ) {
    const element = fileSystem.currentWorkingDirectory.children[index];
    var span = document.createElement("span");
    span.textContent = element.name;
    span.className = element.type;
    content.appendChild(span);
  }
  return content;
}

function cd(args) {
  if (!fileSystem.changeDirectory(args))
    return createNewResultLine(`Cannot find path "${args}".`);
}

function pwd() {
  return createNewResultLine(fileSystem.currentWorkingDirectory.absolutePath);
}

function clear() {
  document.getElementById("commands").innerHTML = "";
}

function cat(args) {
  const object = fileSystem.getObjectByName(args);
  if (!object) {
    return createNewResultLine(`Unknown object "${args}".`);
  }

  if (object.type === "directory") {
    return createNewResultLine(
      `Cannot cat a "${args}" since it is a directory.`
    );
  }

  return createNewResultLine(object.content);
}

function help() {}

function history() {
  let content = createNewResultLine("");
  content.className += " history";
  for (const cmd in commandsHistory) {
    if (Object.hasOwnProperty.call(commandsHistory, cmd)) {
      const element = commandsHistory[cmd];
      var span = document.createElement("span");
      span.textContent = element;
      content.appendChild(span);
    }
  }
  return content;
}

function createNewResultLine(content) {
  var line = document.createElement("li");
  line.className = "result";
  line.innerHTML = content;
  return line;
}

export function incrementHistoryIndex() {
  historyIndex++;
}

export function decrementHistoryIndex() {
  historyIndex--;
}

export { processCommand, history, historyIndex };
