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

export async function mkdir(path) {
  const err = os.mkdir(path);
  throwIfError("mkdir", path, err);
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

function throwIfError(fun, arg, err) {
  if (err)
    throw new Error(`${std.strerror(err)} (os error ${err}), ${fun} '${arg}'`);
}

export async function stat(path) {
  const [
    { dev, ino, mode, nlink, uid, guid, rdev, size, blocks, atime, mtime },
    err,
  ] = await os.stat(path);
  throwIfError("stat", path, err);
  return {
    isFile: mode & os.S_IFREG,
    isDirectory: mode & os.S_IFDIR,
    isSymlink: mode & os.S_IFLNK,
    size,
    mtime: new Date(mtime),
    atime: new Date(mtime),
    dev,
    ino,
    mode,
    nlink,
    uid,
    gid,
    rdev,
    blocks,
  };
}

export async function execSync(cmd) {
  return os.exec(cmd);
}

export function run(opt) {
  return new Process(opt);
}

class Process {
  _status;
  running = true;
  constructor({ cmd, env = {} }) {
    const env2 = { ...std.getenviron(), ...env };
    this.pid = os.exec(cmd, { block: false, env: env2 });
    this._done = (async () => {
      let ret, status;
      while ((([ret, status] = os.waitpid(this.pid, os.WNOHANG)), !ret)) {
        await new Promise((r) => setTimeout(r, 1000));
      }
      this.running = false;
      if (ret < 0) throw ret;
      const signal = status & 0xff;
      const code = (status >> 8) & 0xff;
      console.log("done", signal, code);
      this._status = signal
        ? { success: false, code, signal }
        : { success: !code, code };
      return this._status;
    })();
  }

  status(){
    return this._done;
  }

  kill(signal) {
    if (signal.startsWith("SIG") && os[signal]) signal = os[signal];
    if (this.running) os.kill(this.pid, signal);
  }
}
