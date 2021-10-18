import * as std from "std";
import * as os from "os";

console.error = console.log;
console.debug = function (...args) {
  console.log(
    ...args.map((v) => {
      try {
        return JSON.stringify(v);
      } catch (e) {
        return e;
      }
    })
  );
};

Error.prototype.toString = function () {
  return `${this.name}: ${this.message}\n${this.stack}`.trim();
};

export class env {
  static get(name) {
    return std.getenv(name);
  }
}

export async function readTextFile(path) {
  const data = std.loadFile(path);
  if (data == null) {
    throw new Error(`Could not read ${path}`);
  }
  return data;
}

export async function writeTextFile(path, data) {
  const errorObj = {};
  const file = std.open(path, "w", errorObj);
  if (file == null) {
    throw new Error(std.strerror(errorObj.errno));
  }
  file.puts(data);
  file.close();
}

export async function exec(cmd) {
  return os.exec(cmd);
}
