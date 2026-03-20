import {
  Cd,
  Clear,
  Command,
  Ls,
  Pwd,
  History,
  Theme,
  Cat,
  Help,
  Exit,
} from "./commands.js";
import { createNewResultLine } from "./utils.js";

export class TerminalCommand {
  name: string;
  command: null | Command;
  args: string;

  constructor(
    name: string = "",
    command: null | Command = null,
    args: string = ""
  ) {
    this.name = name;
    this.command = command;
    if (this.command) {
      this.command.arguments = args;
    }
    this.args = args;
  }
}

export class Terminal {
  historyIndex: number = 0;
  commandsHistory: string[] = [];
  darkTheme: boolean = true;
  commands: Command[];
  terminalCommand: TerminalCommand;

  constructor(
    commandsHistory: string[] = [],
    historyIndex: number = 0,
    darkTheme: boolean = true
  ) {
    this.commandsHistory = commandsHistory;
    this.darkTheme = darkTheme;
    this.historyIndex = historyIndex;
    this.commands = [
      new Ls("ls", true),
      new Cd("cd", true, true),
      new Pwd("pwd"),
      new Clear("clear"),
      new Cat("cat", true, true),
      new Help("help"),
      new History("history"),
      new Theme("theme", true, true),
      new Exit("exit"),
    ];
    this.terminalCommand = new TerminalCommand();
  }

  processInput(input: string) {
    this.commandsHistory.push(input);
    this.historyIndex = this.commandsHistory.length;

    this.parseInput(input);

    return this.execute();
  }

  parseInput(input: string) {
    const spaceIndex = input.indexOf(" ");
    if (spaceIndex === -1) {
      this.terminalCommand = new TerminalCommand(
        input,
        (this.commands.find((c: Command) => c.name === input) as Command) ||
          null
      );
      return;
    }
    const name = input.slice(0, spaceIndex).trim();
    const args = input.slice(spaceIndex, input.length).trim();
    this.terminalCommand = new TerminalCommand(
      name,
      this.commands.find((c: Command) => c.name === name) as Command,
      args
    );
  }

  execute() {
    if (!this.terminalCommand.command) {
      return createNewResultLine(
        `Command not found: "${this.terminalCommand.name}". Type "help" for more information.`
      );
    }

    if (
      this.terminalCommand.command.hasArguments &&
      this.terminalCommand.command.areArgumentsMandatory &&
      !this.terminalCommand.args
    ) {
      return createNewResultLine(
        `Command "${this.terminalCommand.command.name}" requires additional arguments. Type "help" for more information.`
      );
    }

    return this.terminalCommand.command.execute();
  }

  incrementHistoryIndex() {
    this.historyIndex++;
  }

  decrementHistoryIndex() {
    this.historyIndex--;
  }

  getHistoryIndex() {
    return this.historyIndex;
  }

  isDarkTheme() {
    return this.darkTheme;
  }

  setIsDarkTheme(isDark: boolean) {
    this.darkTheme = isDark;
  }

  getCommandsHistory() {
    return this.commandsHistory;
  }

  getPreviousCommand() {
    if (this.historyIndex <= 0) {
      return this.commandsHistory[0];
    }

    this.decrementHistoryIndex();
    return this.commandsHistory[this.historyIndex];
  }

  getNextCommand() {
    if (this.historyIndex >= this.commandsHistory.length) {
      return "";
    }

    if (this.historyIndex === this.commandsHistory.length - 1) {
      this.incrementHistoryIndex();
      return "";
    }

    this.incrementHistoryIndex();
    return this.commandsHistory[this.historyIndex];
  }
}

const terminal = new Terminal();
export { terminal };
