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
} from "./commands.js";
import { createNewResultLine } from "./utils.js";

class Terminal {
  historyIndex: number = 0;
  static commandsHistory: string[] = [];
  static darkTheme: boolean = true;
  commands: Command[];
  command: null | Command;
  args: string | string[] | undefined | null;
  commandName: string;

  constructor(
    commandsHistory: Command[],
    historyIndex: number,
    darkTheme: boolean
  ) {
    commandsHistory = commandsHistory;
    darkTheme = darkTheme;
    this.historyIndex = historyIndex;
    this.commands = [
      new Ls("ls", true),
      new Cd("cd", true),
      new Pwd("pwd"),
      new Clear("clear"),
      new Cat("cat", true),
      new Help("help"),
      new History("history"),
      new Theme("theme", true),
    ];
    this.command = null;
    this.args = null;
    this.commandName = "";
  }

  processInput(input: string) {
    Terminal.commandsHistory.push(input);
    this.historyIndex = 0;

    this.parseInput(input);

    return this.execute();
  }

  parseInput(input: string) {
    const spaceIndex = input.indexOf(" ");
    if (spaceIndex === -1) {
      this.commandName = input;
      this.command =
        (this.commands.find((c: Command) => c.name === input) as Command) ||
        null;
      return;
    }
    const name = input.slice(0, spaceIndex).trim();
    const args = input.slice(spaceIndex, input.length).trim();
    this.commandName = name;
    this.command = this.commands.find(
      (c: Command) => c.name === name
    ) as Command;
    this.args = args;
  }

  execute() {
    if (!this.command) {
      return createNewResultLine(
        `Command not found: "${this.commandName}". Type "help" for more information.`
      );
    }

    if (this.command.args) {
      return this.command.execute(this.args);
    }

    return this.command.execute();
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

  static isDarkTheme() {
    return this.darkTheme;
  }

  static setTheme(isDark: boolean) {
    this.darkTheme = isDark;
  }

  static getCommandsHistory() {
    return this.commandsHistory;
  }
}

export { Terminal };
