import { COMMANDS } from "./constants.js";
import { fileSystem } from "./fs.js";

var commandsHistory = [];
var historyIndex = 0;
var darkTheme = true;

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
    case "theme":
      return theme(args);
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
  if (!args || !fileSystem.changeDirectory(args))
    return createNewResultLine(`Cannot find path "${args}".`);
}

function pwd() {
  return createNewResultLine(fileSystem.currentWorkingDirectory.absolutePath);
}

function clear() {
  document.getElementById("commands").innerHTML = "";
}

function cat(args) {
  if (!args) {
    return createNewResultLine(
      `You have to provide additional arguments. Type "help" for more information.`
    );
  }

  const object = fileSystem.getObjectByName(args);
  if (!object) {
    return createNewResultLine(
      `Unknown object "${args}". Type "help" for more information.`
    );
  }

  if (object.type === "directory") {
    return createNewResultLine(
      `Cannot "cat" a "${args}" since it is a directory. Type "help" for more information.c`
    );
  }

  return createNewResultLine(object.content);
}

function help() {
  var content = createNewResultLine("");
  content.className += " help";
  content.textContent += "List of all available commands:";
  for (const [key, value] of Object.entries(COMMANDS)) {
    var span = document.createElement("span");
    span.className += "help-commands";

    var command = document.createElement("span");
    command.className += "help-command";
    command.textContent = `${key}`;

    var dash = document.createElement("span");
    dash.className += "dash";
    dash.textContent = `-`;

    var description = document.createElement("span");
    description.className += "command-description";
    description.textContent = `${value.shortDescription}`;

    span.appendChild(command);
    span.appendChild(dash);
    span.appendChild(description);
    content.appendChild(span);
  }

  return content;
}

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

function theme(args) {
  args = args.toLowerCase();
  if (!["dark", "light"].includes(args)) {
    return createNewResultLine(
      `There are only 2 themes "dark" and "light". Type "help" for more information.`
    );
  }

  if ((darkTheme && args === "dark") || (!darkTheme && args === "light")) {
    return;
  }

  let navbar = document.getElementById("navbar");
  navbar.classList.toggle("navbar-light-theme");

  let heading = document.getElementById("heading");
  heading.classList.toggle("light-theme");

  let footer = document.getElementById("footer");
  footer.classList.toggle("footer-light-theme");

  let socialIcons = document.getElementsByClassName("social-icon");
  for (const index in socialIcons) {
    if (Object.hasOwnProperty.call(socialIcons, index)) {
      const icon = socialIcons[index];
      icon.src = icon.src.replace(
        darkTheme ? "white" : "black",
        darkTheme ? "black" : "white"
      );
    }
  }

  document.getElementById("theme-toggle").checked = darkTheme;
  darkTheme = !darkTheme;
}

export function incrementHistoryIndex() {
  historyIndex++;
}

export function decrementHistoryIndex() {
  historyIndex--;
}

export { processCommand, commandsHistory, historyIndex, darkTheme };
