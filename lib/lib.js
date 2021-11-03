import "./polyfills.js";

import * as std from "std";
import * as os from "os";

if (!globalThis.setTimeout) globalThis.setTimeout = os.setTimeout;
if (!globalThis.clearTimeout) globalThis.clearTimeout = os.clearTimeout;

export const timeout = (time_ms) => new Promise((r) => setTimeout(r, time_ms));

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

export async function execSync(cmd) {
  return os.exec(cmd);
}

export function run({ cmd }) {
  return new Process(cmd);
}

class Process {
  status;
  running = true;
  constructor(cmd) {
    this.pid = os.exec(cmd, { block: false });
    this.done = (async () => {
      let ret, status;
      while ((([ret, status] = os.waitpid(this.pid, os.WNOHANG)), !ret)) {
        await new Promise((r) => setTimeout(r, 1000));
      }
      this.running = false;
      if (ret < 0) throw ret;
      const signal = status & 0xff;
      const code = (status >> 8) & 0xff;
      this.status = signal
        ? { success: false, code, signal }
        : { success: !code, code };
      return this.status;
    })();
  }

  kill(signal) {
    if (signal.startsWith("SIG") && os[signal]) signal = os[signal];
    if (this.running) os.kill(this.pid, signal);
  }
}
