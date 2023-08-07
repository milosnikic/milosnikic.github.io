import { fileSystem } from "./fs.js";
import { COMMANDS } from "./constants.js";
import { terminal } from "./terminal.js";
import { createNewResultLine, changeTheme } from "./utils.js";
export class Command {
    constructor(name, args = false, mandatoryArgs = false) {
        this.arguments = "";
        this.name = name;
        this.hasArguments = args;
        this.areArgumentsMandatory = mandatoryArgs;
    }
    toString() {
        if (this.hasArguments) {
            return `${this.name} ${this.arguments}`;
        }
        return this.name;
    }
}
export class Ls extends Command {
    execute() {
        var content = createNewResultLine("");
        if (!fileSystem.currentWorkingDirectory.children) {
            return content;
        }
        let nodes = null;
        if (this.arguments) {
            nodes = fileSystem.listDirectoryPath(this.arguments);
        }
        else {
            nodes = fileSystem.listCurrentWorkingDirectory();
        }
        if (!nodes) {
            return createNewResultLine(`Cannot list directory with specified arguments: ${this.arguments}. Type "help" for more information.`);
        }
        for (let index = 0; index < nodes.length; index++) {
            const element = nodes[index];
            var span = document.createElement("span");
            span.textContent = element.name;
            span.className = element.type;
            content.appendChild(span);
        }
        return content;
    }
}
export class Cd extends Command {
    execute() {
        if (!this.arguments ||
            Array.isArray(this.arguments) ||
            !fileSystem.changeDirectory(this.arguments))
            return createNewResultLine(`Cannot find path "${this.arguments}".`);
        return createNewResultLine("");
    }
}
export class Pwd extends Command {
    execute() {
        return createNewResultLine(fileSystem.currentWorkingDirectory.absolutePath);
    }
}
export class Clear extends Command {
    execute() {
        document.getElementById("commands").innerHTML = "";
    }
}
export class Cat extends Command {
    execute() {
        if (!this.arguments || Array.isArray(this.arguments)) {
            return createNewResultLine(`You have to provide additional arguments. Type "help" for more information.`);
        }
        const object = fileSystem.resolve(this.arguments);
        if (!object) {
            return createNewResultLine(`Unknown object "${this.arguments}". Type "help" for more information.`);
        }
        if (object.type === "directory") {
            return createNewResultLine(`Cannot "cat" a "${this.arguments}" since it is a directory. Type "help" for more information.c`);
        }
        return createNewResultLine(object.content);
    }
}
export class Help extends Command {
    execute() {
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
}
export class History extends Command {
    execute() {
        let content = createNewResultLine("");
        content.className += " history";
        const commandsHistory = terminal.getCommandsHistory();
        for (const cmd in commandsHistory) {
            if (Object.hasOwnProperty.call(commandsHistory, cmd)) {
                const element = commandsHistory[cmd];
                var span = document.createElement("span");
                span.textContent = element.toString();
                content.appendChild(span);
            }
        }
        return content;
    }
}
export class Theme extends Command {
    execute() {
        if (Array.isArray(this.arguments) ||
            !this.arguments ||
            !["dark", "light"].includes(this.arguments.toLocaleLowerCase())) {
            return createNewResultLine(`There are only 2 themes "dark" and "light". Type "help" for more information.`);
        }
        if ((this.arguments === "dark" && terminal.isDarkTheme()) ||
            (this.arguments === "light" && !terminal.isDarkTheme())) {
            return;
        }
        changeTheme();
    }
}
export class Exit extends Command {
    execute() {
        const result = window.confirm("Are you sure you want to exit page?");
        if (result) {
            window.close();
        }
    }
}
