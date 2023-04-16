import { Terminal } from "../src/js/terminal.js";
import jsdom from "jsdom";
const { JSDOM } = jsdom;
import { Cd, Pwd } from "../src/js/commands.js";

describe("Terminal", function () {
  let terminal = new Terminal([], 0, true);
  const cd = new Cd("cd", true);

  describe("process input", function () {
    const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>");
    global.window = dom.window as unknown as Window & typeof globalThis;
    global.document = dom.window.document;

    it("should return that command is not found", function () {
      const commandsHistoryLength = Terminal.commandsHistory.length;
      const result: HTMLLIElement = terminal.processInput(
        "echo 'Hello'"
      ) as HTMLLIElement;

      expect(terminal.historyIndex).toBe(0);
      expect(Terminal.commandsHistory.length).toBe(commandsHistoryLength + 1);
      expect(result.innerHTML).toBe(
        'Command not found: "echo". Type "help" for more information.'
      );
    });

    it("should execute command with arguments", function () {
      terminal.command = cd;
      terminal.args = "education";
      const spy = spyOn(cd, "execute");

      terminal.execute();

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith("education");
    });

    it("should execute command without arguments", function () {
      const pwd = new Pwd("pwd");
      terminal.command = pwd;
      terminal.args = "education";
      const spy = spyOn(pwd, "execute");

      terminal.execute();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe("parse input", function () {
    it("should set undefined for command when command is not known", function () {
      terminal.parseInput("echo");

      expect(terminal.command).toBeNull();
    });

    it("should set command with specified name", function () {
      terminal.parseInput("cd");

      expect(terminal.command).toEqual(cd);
    });

    it("should set command with arguments", function () {
      terminal.parseInput("cd education");

      expect(terminal.command).toEqual(cd);
      expect(terminal.args).toEqual("education");
    });

    it("should set command with arguments with extra spaces", function () {
      terminal.parseInput("cd   education  ");

      expect(terminal.command).toEqual(cd);
      expect(terminal.args).toEqual("education");
    });
  });
});
