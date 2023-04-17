import { Terminal, TerminalCommand } from "../src/js/terminal.js";
import jsdom from "jsdom";
const { JSDOM } = jsdom;
import { Cd, Pwd } from "../src/js/commands.js";

describe("Terminal", function () {
  let terminal = new Terminal([], 0, true);
  const cd = new Cd("cd", true, true);

  describe("process input", function () {
    const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>");
    global.window = dom.window as unknown as Window & typeof globalThis;
    global.document = dom.window.document;

    it("shuld add command to history", function () {
      const commandsHistoryLength = terminal.commandsHistory.length;

      terminal.processInput("echo 'Hello'") as HTMLLIElement;

      expect(terminal.historyIndex).toBe(0);
      expect(terminal.commandsHistory.length).toBe(commandsHistoryLength + 1);
    });

    it("should return that command is not found", function () {
      const result: HTMLLIElement = terminal.processInput(
        "echo 'Hello'"
      ) as HTMLLIElement;

      expect(result.innerHTML).toBe(
        'Command not found: "echo". Type "help" for more information.'
      );
    });

    it("should return that command needs arguments when they are mandatory but not provided", function () {
      terminal.terminalCommand = new TerminalCommand("cd", cd);
      const spy = spyOn(cd, "execute");

      const result: HTMLLIElement = terminal.execute() as HTMLLIElement;

      expect(spy).not.toHaveBeenCalled();
      expect(result.innerHTML).toBe(
        'Command "cd" requires additional arguments. Type "help" for more information.'
      );
    });

    it("should execute command with arguments", function () {
      terminal.terminalCommand = new TerminalCommand("cd", cd, "education");
      const spy = spyOn(cd, "execute");

      terminal.execute();

      expect(spy).toHaveBeenCalled();
    });

    it("should execute command without arguments", function () {
      const pwd = new Pwd("pwd");
      terminal.terminalCommand = new TerminalCommand("pwd", pwd, "education");
      const spy = spyOn(pwd, "execute");

      terminal.execute();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe("parse input", function () {
    it("should set undefined for command when command is not known", function () {
      terminal.parseInput("echo");

      expect(terminal.terminalCommand.command).toBeNull();
      expect(terminal.terminalCommand.args).toBe("");
      expect(terminal.terminalCommand.name).toBe("echo");
    });

    it("should set command with specified name", function () {
      cd.arguments = "";

      terminal.parseInput("cd");

      expect(terminal.terminalCommand.command).toEqual(cd);
      expect(terminal.terminalCommand.args).toBe("");
      expect(terminal.terminalCommand.name).toBe("cd");
    });

    it("should set command with arguments", function () {
      cd.arguments = "education";

      terminal.parseInput("cd education");

      expect(terminal.terminalCommand.command).toEqual(cd);
      expect(terminal.terminalCommand.args).toEqual("education");
      expect(terminal.terminalCommand.name).toBe("cd");
    });

    it("should set command with arguments with extra spaces", function () {
      cd.arguments = "education";

      terminal.parseInput("cd   education  ");

      expect(terminal.terminalCommand.command).toEqual(cd);
      expect(terminal.terminalCommand.args).toEqual("education");
      expect(terminal.terminalCommand.name).toEqual("cd");
    });
  });
});
