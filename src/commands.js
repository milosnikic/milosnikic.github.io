import { fileSystem } from "./fs.js";

function processCommand(cmd) {
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
    default:
      return createNewResultLine(
        `Unknown command "${command}". Type "help" for more information.`
      );
  }
}

function createNewResultLine(content) {
  var line = document.createElement("li");
  line.className = "result";
  line.textContent = content;
  return line;
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
  if (fileSystem.changeDirectory(args)) {
    return "";
  }

  return createNewResultLine(`Cannot find path ${args}.`);
}

function pwd() {
  return createNewResultLine(fileSystem.currentWorkingDirectory.absolutePath);
}

function clear() {
  document.getElementById("commands").innerHTML = "";
}

export { processCommand };
