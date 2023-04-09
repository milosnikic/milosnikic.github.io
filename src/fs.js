import {
  BIOGRAPHY_TEXT,
  BACHELORS_DEGREE_TEXT,
  MASTERS_DEGREE_TEXT,
  PROJECTS,
} from "./constants.js";

class Node {
  constructor(name, type, children = null, content = null, absolutePath = "") {
    this.name = name;
    this.type = type;
    this.children = children;
    this.content = content;
    this.absolutePath = absolutePath;
  }
}

class FileSystem {
  constructor() {
    this.root = new Node(
      "/",
      "directory",
      [
        new Node("bio.txt", "file", null, BIOGRAPHY_TEXT, "/bio.txt"),
        new Node(
          "education",
          "directory",
          [
            new Node(
              "faculty",
              "directory",
              [
                new Node(
                  "Bachelor's degree Faculty of Organizational Sciences.txt",
                  "file",
                  null,
                  BACHELORS_DEGREE_TEXT,
                  "/education/faculty/Bachelor's degree Faculty of Organizational Sciences.txt"
                ),
                new Node(
                  "Master's degree Faculty of Organizational Sciences.txt",
                  "file",
                  null,
                  MASTERS_DEGREE_TEXT,
                  "/education/faculty/Master's degree Faculty of Organizational Sciences.txt"
                ),
              ],
              null,
              "/education/faculty"
            ),
            new Node("udemy", "directory", [], null, "/education/udemy"),
          ],
          null,
          "/education"
        ),
        new Node("experience", "directory", [], null, "/experience"),
        new Node(
          "projects",
          "directory",
          [
            new Node(
              "FootballApp.txt",
              "file",
              null,
              PROJECTS.FOOTBALL_APP_TEXT,
              "/FootballApp.txt"
            ),
            new Node(
              "Battleship.txt",
              "file",
              null,
              PROJECTS.BATTLESHIP_APP_TEXT,
              "/Battleship.txt"
            ),
            new Node(
              "Magicmap.txt",
              "file",
              null,
              PROJECTS.MAGIC_MAP_APP_TEXT,
              "/Magicmap.txt"
            ),
            new Node(
              "Arduino Thermal System.txt",
              "file",
              null,
              PROJECTS.THERMALSYSTEM_APP_TEXT,
              "/Arduino Thermal System.txt"
            ),
            new Node(
              "ASCII Art.txt",
              "file",
              null,
              PROJECTS.ASCII_ART_APP_TEXT,
              "/ASCII Art.txt"
            ),
            new Node(
              "Cerberus.txt",
              "file",
              null,
              PROJECTS.CERBERUS_APP_TEXT,
              "/Cerberus.txt"
            ),
          ],
          null,
          "/projects"
        ),
      ],
      null,
      "/"
    );
    this.currentWorkingDirectory = this.root;
  }

  changeDirectory(destination) {
    var directories = [];

    if (destination === "/") {
      this.currentWorkingDirectory = this.root;
      return true;
    }

    // Remove trailing /
    if (destination[destination.length - 1] == "/") {
      destination = destination.slice(0, destination.length - 1);
    }

    // Shortcut
    if (destination === "..") {
      var parent = this.getParent(this.currentWorkingDirectory);
      if (parent) {
        this.currentWorkingDirectory = parent;
        return true;
      }
      return false;
    }

    // Absolute
    if (destination.startsWith("/")) {
      destination = destination.slice(1, destination.length);
      directories = destination.split("/");
      return this.changeDir(directories, this.root);
    }

    // Relative
    if (destination.startsWith("./")) {
      destination = destination.slice(2, destination.length);
      directories = destination.split("/");
      return this.changeDir(directories, this.currentWorkingDirectory);
    }

    // Relative to parent
    if (destination.startsWith("../")) {
      directories = destination.split("/");
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
            } else {
              return false;
            }
          }
        }
      }

      const current = child.children.find(
        (f) => f.name === directories[directories.length - 1]
      );

      if (current !== undefined) {
        this.currentWorkingDirectory = current;
        return true;
      }

      return false;
    }

    return this.changeDir(destination.split("/"), this.currentWorkingDirectory);
  }

  changeDir(directories, origin) {
    var directoryIndex = 0;
    var destination = origin;
    while (directoryIndex < directories.length) {
      destination = destination.children.find(
        (c) => c.name === directories[directoryIndex]
      );
      if (!destination || destination.type === "file") {
        return false;
      }
      directoryIndex++;
    }
    this.currentWorkingDirectory = destination;
    return true;
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

    for (const dir in current.children) {
      if (Object.hasOwnProperty.call(current.children, dir)) {
        const child = current.children[dir];
        var parent = this.getParent(node, child);
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

    for (const obj in current.children) {
      if (Object.hasOwnProperty.call(current.children, obj)) {
        const element = current.children[obj];
        let result = this.getObjectByName(name, element);
        if (result) {
          return result;
        }
      }
    }

    return null;
  }
}

var fileSystem = new FileSystem();

export { fileSystem };
