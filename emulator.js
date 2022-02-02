import { HardwareComponent, EaasMachine } from "./lib/eaas.js";
import { run } from "./lib/lib.js";

export class Machine extends EaasMachine {
  args = [
    "SheepShaver",
    "--nosound",
    "true",
    "--ramsize",
    "268435456",
    "--jit",
    "true",
    "--ignoreillegal",
    "true",
    "--ignoresegv",
    "true",
    "--jit68k",
    "true",
    "--idlewait",
    "true",
  ];

  constructor() {
    super();
  }
  async start() {
    super.start();
    await new Promise((r) => setTimeout(r, 5000));
    const env = { DISPLAY: ":7000" };

    console.debug(await run({ cmd: this.args, env }).status());

    // await run({ cmd: "xterm", env }).status();

    return;
    `DISPLAY=:0 ./SheepShaver --nosound true --rom /tmp/.X11-unix/xxx.rom  --disk /tmp/.X11-unix/8xxx.raw --ether vde --switch /tmp/.X11-unix/ --ramsize 268435456 --jit true --ignoresegv true --ignoreillegal true --jit68k true --idlewait true`;
    `vde_switch -s /tmp/.X11-unix/`;
    `slirpvde -s /tmp/.X11-unix/`;
    `vde_plug -s /tmp/.X11-unix/`;
  }
}

export class Rom extends HardwareComponent {
  constructor(conf) {
    super();
    this.path = conf.path;
  }

  addedToMachine(/** @type {Machine} */ machine) {
    machine.args.push("--rom", this.path);
  }
}
export class Disk extends HardwareComponent {
  constructor(conf) {
    super();
    this.path = conf.path;
  }

  addedToMachine(/** @type {Machine} */ machine) {
    machine.args.push("--disk", this.path);
  }
}
