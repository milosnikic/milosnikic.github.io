import { Cd, Clear, Ls, Pwd, History, Theme, Cat, Help, } from "./commands.js";
import { createNewResultLine } from "./utils.js";
export class TerminalCommand {
    constructor(name = "", command = null, args = "") {
        this.name = name;
        this.command = command;
        if (this.command) {
            this.command.arguments = args;
        }
        this.args = args;
    }
}
export class Terminal {
    constructor(commandsHistory = [], historyIndex = 0, darkTheme = true) {
        this.historyIndex = 0;
        this.commandsHistory = [];
        this.darkTheme = true;
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
        ];
        this.terminalCommand = new TerminalCommand();
    }
    processInput(input) {
        this.commandsHistory.push(input);
        this.historyIndex = 0;
        this.parseInput(input);
        return this.execute();
    }
    parseInput(input) {
        const spaceIndex = input.indexOf(" ");
        if (spaceIndex === -1) {
            this.terminalCommand = new TerminalCommand(input, this.commands.find((c) => c.name === input) ||
                null);
            return;
        }
        const name = input.slice(0, spaceIndex).trim();
        const args = input.slice(spaceIndex, input.length).trim();
        this.terminalCommand = new TerminalCommand(name, this.commands.find((c) => c.name === name), args);
    }
    execute() {
        if (!this.terminalCommand.command) {
            return createNewResultLine(`Command not found: "${this.terminalCommand.name}". Type "help" for more information.`);
        }
        if (this.terminalCommand.command.hasArguments &&
            this.terminalCommand.command.areArgumentsMandatory &&
            !this.terminalCommand.args) {
            return createNewResultLine(`Command "${this.terminalCommand.command.name}" requires additional arguments. Type "help" for more information.`);
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
    setIsDarkTheme(isDark) {
        this.darkTheme = isDark;
    }
    getCommandsHistory() {
        return this.commandsHistory;
    }
}
const terminal = new Terminal();
export { terminal };
