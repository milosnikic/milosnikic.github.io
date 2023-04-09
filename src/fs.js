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
        new Node("bio.txt", "file", null, "This is biography", "/bio.txt"),
        new Node(
          "education",
          "directory",
          [
            new Node(
              "faculty",
              "directory",
              [
                new Node(
                  "Bachelors Degree Faculty of organizational Sciences.txt",
                  "file",
                  null,
                  "Bachelors degree",
                  "/education/faculty/Bachelors Degree Faculty of organizational Sciences.txt"
                ),
                new Node(
                  "Masters Degree Faculty of organizational Sciences.txt",
                  "file",
                  null,
                  "Masters Software Engineering",
                  "/education/faculty/Masters Degree Faculty of organizational Sciences.txt"
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
        new Node("projects", "directory", [], null, "/projects"),
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
}

var fileSystem = new FileSystem();

export { fileSystem };
