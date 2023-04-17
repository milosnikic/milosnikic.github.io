import { fileSystem } from "./fs.js";
import { COMMANDS } from "./constants.js";
import { Terminal } from "./terminal.js";
import { createNewResultLine } from "./utils.js";
export class Command {
    constructor(name, args = false) {
        this.name = name;
        this.args = args;
    }
    toString(args) {
        if (this.args) {
            if (typeof args === "string")
                return `${this.name} ${args}`;
            if (Array.isArray(args))
                return `${this.name} ${args.join(" ")}`;
        }
        return this.name;
    }
}
export class Ls extends Command {
    execute(args) {
        var content = createNewResultLine("");
        if (!fileSystem.currentWorkingDirectory.children) {
            return content;
        }
        for (let index = 0; index < fileSystem.currentWorkingDirectory.children.length; index++) {
            const element = fileSystem.currentWorkingDirectory.children[index];
            var span = document.createElement("span");
            span.textContent = element.name;
            span.className = element.type;
            content.appendChild(span);
        }
        return content;
    }
}
export class Cd extends Command {
    execute(args) {
        if (!args || Array.isArray(args) || !fileSystem.changeDirectory(args))
            return createNewResultLine(`Cannot find path "${args}".`);
        return createNewResultLine("");
    }
}
export class Pwd extends Command {
    execute(args) {
        return createNewResultLine(fileSystem.currentWorkingDirectory.absolutePath);
    }
}
export class Clear extends Command {
    execute(args) {
        document.getElementById("commands").innerHTML = "";
    }
}
export class Cat extends Command {
    execute(args) {
        if (!args || Array.isArray(args)) {
            return createNewResultLine(`You have to provide additional arguments. Type "help" for more information.`);
        }
        const object = fileSystem.getObjectByName(args);
        if (!object) {
            return createNewResultLine(`Unknown object "${args}". Type "help" for more information.`);
        }
        if (object.type === "directory") {
            return createNewResultLine(`Cannot "cat" a "${args}" since it is a directory. Type "help" for more information.c`);
        }
        return createNewResultLine(object.content);
    }
}
export class Help extends Command {
    execute(args) {
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
    execute(args) {
        let content = createNewResultLine("");
        content.className += " history";
        const commandsHistory = Terminal.getCommandsHistory();
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
    execute(args) {
        if (Array.isArray(args) ||
            !args ||
            !["dark", "light"].includes(args.toLocaleLowerCase())) {
            return createNewResultLine(`There are only 2 themes "dark" and "light". Type "help" for more information.`);
        }
        let navbar = document.getElementById("navbar");
        navbar.classList.toggle("navbar-light-theme");
        let heading = document.getElementById("heading");
        heading.classList.toggle("light-theme");
        let footer = document.getElementById("footer");
        footer.classList.toggle("footer-light-theme");
        let socialIcons = document.getElementsByClassName("social-icon");
        const darkTheme = Terminal.isDarkTheme();
        for (const index in socialIcons) {
            if (Object.hasOwnProperty.call(socialIcons, index)) {
                const element = socialIcons[index];
                const icon = element;
                icon.src = icon.src.replace(darkTheme ? "white" : "black", darkTheme ? "black" : "white");
            }
        }
        const element = document.getElementById("theme-toggle");
        const themeToggle = element;
        themeToggle.checked = darkTheme;
        Terminal.setIsDarkTheme(!darkTheme);
    }
}
