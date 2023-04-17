import { BIOGRAPHY_TEXT, BACHELORS_DEGREE_TEXT, MASTERS_DEGREE_TEXT, PROJECTS, } from "./constants.js";
export class Node {
    constructor(name, type, children = null, content = null, absolutePath = "") {
        this.name = name;
        this.type = type;
        this.children = children;
        this.content = content;
        this.absolutePath = absolutePath;
    }
}
export class FileSystem {
    constructor() {
        this.root = new Node("/", "directory", [
            new Node("bio.txt", "file", null, BIOGRAPHY_TEXT, "/bio.txt"),
            new Node("education", "directory", [
                new Node("faculty", "directory", [
                    new Node("Bachelor's degree Faculty of Organizational Sciences.txt", "file", null, BACHELORS_DEGREE_TEXT, "/education/faculty/Bachelor's degree Faculty of Organizational Sciences.txt"),
                    new Node("Master's degree Faculty of Organizational Sciences.txt", "file", null, MASTERS_DEGREE_TEXT, "/education/faculty/Master's degree Faculty of Organizational Sciences.txt"),
                ], null, "/education/faculty"),
            ], null, "/education"),
            new Node("experience", "directory", [], null, "/experience"),
            new Node("projects", "directory", [
                new Node("FootballApp.txt", "file", null, PROJECTS.FOOTBALL_APP_TEXT, "/FootballApp.txt"),
                new Node("Battleship.txt", "file", null, PROJECTS.BATTLESHIP_APP_TEXT, "/Battleship.txt"),
                new Node("Magicmap.txt", "file", null, PROJECTS.MAGIC_MAP_APP_TEXT, "/Magicmap.txt"),
                new Node("Arduino Thermal System.txt", "file", null, PROJECTS.THERMALSYSTEM_APP_TEXT, "/Arduino Thermal System.txt"),
                new Node("ASCII Art.txt", "file", null, PROJECTS.ASCII_ART_APP_TEXT, "/ASCII Art.txt"),
                new Node("Cerberus.txt", "file", null, PROJECTS.CERBERUS_APP_TEXT, "/Cerberus.txt"),
                new Node("Carvana.txt", "file", null, PROJECTS.CARVANA_ML_TEXT, "/Carvana.txt"),
            ], null, "/projects"),
        ], null, "/");
        this.currentWorkingDirectory = this.root;
    }
    changeDirectory(path) {
        const directory = this.resolve(path);
        if (!directory || directory.type === "file") {
            return false;
        }
        this.currentWorkingDirectory = directory;
        return true;
    }
    resolve(path) {
        // Root
        if (path === "/") {
            return this.root;
        }
        // Remove trailing /
        if (path[path.length - 1] == "/") {
            path = path.slice(0, path.length - 1);
        }
        // Shortcut
        if (path === "..") {
            var parent = this.getParent(this.currentWorkingDirectory);
            if (parent) {
                return parent;
            }
            return null;
        }
        // Absolute path
        //
        // Example: /projects/Carvana.txt
        if (path.startsWith("/")) {
            return this.resolvePath(path.slice(1, path.length).split("/"), this.root);
        }
        // Relative path
        //
        // Example: ./education
        if (path.startsWith("./")) {
            return this.resolvePath(path.slice(2, path.length).split("/"), this.currentWorkingDirectory);
        }
        // Relative to parent
        //
        // Example: ../experience
        if (path.startsWith("../")) {
            let directories = path.split("/");
            let child = this.currentWorkingDirectory;
            // We need to replace each double dot with corresponding parent
            // and at the and we check if we can reach from last parent
            // to final directory
            for (const name in directories) {
                if (Object.hasOwnProperty.call(directories, name)) {
                    const element = directories[name];
                    if (element === "..") {
                        const parent = this.getParent(child);
                        if (parent) {
                            child = parent;
                            continue;
                        }
                        else {
                            return null;
                        }
                    }
                }
            }
            const current = child.children.find((f) => f.name === directories[directories.length - 1]);
            if (current !== undefined) {
                return current;
            }
            return null;
        }
        // Basic path
        //
        // Example: education/faculty
        return this.resolvePath(path.split("/"), this.currentWorkingDirectory);
    }
    resolvePath(directories, origin) {
        var directoryIndex = 0;
        var destination = origin;
        while (directoryIndex < directories.length) {
            destination = destination.children.find((c) => c.name === directories[directoryIndex]);
            if (!destination) {
                return null;
            }
            directoryIndex++;
        }
        return destination;
    }
    getParent(node, current = this.root) {
        if (node === this.root) {
            return null;
        }
        if (current.type === "file") {
            return null;
        }
        if (current.children.includes(node)) {
            return current;
        }
        if (current.children) {
            for (const child of current.children) {
                const parent = this.getParent(node, child);
                if (parent) {
                    return parent;
                }
            }
        }
        return null;
    }
    getObjectByName(name, current = this.root) {
        if (current.name === name) {
            return current;
        }
        if (current.children) {
            for (const element of current.children) {
                let result = this.getObjectByName(name, element);
                if (result) {
                    return result;
                }
            }
        }
        return null;
    }
    listCurrentWorkingDirectory() {
        return this.listDirectory(this.currentWorkingDirectory);
    }
    listDirectoryPath(path) {
        const directory = this.resolve(path);
        if (!directory || directory.type === "file") {
            return null;
        }
        return this.listDirectory(directory);
    }
    listDirectory(directory) {
        let nodes = [];
        for (let index = 0; index < directory.children.length; index++) {
            nodes.push(directory.children[index]);
        }
        return nodes;
    }
}
var fileSystem = new FileSystem();
export { fileSystem };
