import { Cd, Clear, Ls, Pwd, History, Theme, Cat, Help, } from "./commands.js";
import { createNewResultLine } from "./utils.js";
class Terminal {
    constructor(commandsHistory, historyIndex, darkTheme) {
        this.historyIndex = 0;
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
        this.commandName = "";
        this.args = null;
    }
    processInput(input) {
        Terminal.commandsHistory.push(input);
        this.historyIndex = 0;
        this.parseInput(input);
        return this.execute();
    }
    parseInput(input) {
        const spaceIndex = input.indexOf(" ");
        if (spaceIndex === -1) {
            this.commandName = input;
            this.command =
                this.commands.find((c) => c.name === input) ||
                    null;
            return;
        }
        const name = input.slice(0, spaceIndex).trim();
        const args = input.slice(spaceIndex, input.length).trim();
        this.commandName = name;
        this.command = this.commands.find((c) => c.name === name);
        this.args = args;
    }
    execute() {
        if (!this.command) {
            return createNewResultLine(`Command not found: "${this.commandName}". Type "help" for more information.`);
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
    static setIsDarkTheme(isDark) {
        this.darkTheme = isDark;
    }
    static getCommandsHistory() {
        return this.commandsHistory;
    }
}
Terminal.commandsHistory = [];
Terminal.darkTheme = true;
export { Terminal };
