import { HardwareComponent, EaasMachine } from "./lib/eaas.js";

export class Machine extends EaasMachine {
  args = ["SheepShaver", "--nosound", "true", "--ramsize"];

  constructor() {
    super();
    console.log("Basilisk");
  }
  start() {
    `DISPLAY=:0 ./SheepShaver --nosound true --rom /tmp/.X11-unix/xxx.rom  --disk /tmp/.X11-unix/8xxx.raw --ether vde --switch /tmp/.X11-unix/ --ramsize 268435456 --jit true --ignoresegv true --ignoreillegal true --jit68k true --idlewait true`;
    `vde_switch -s /tmp/.X11-unix/`;
    `slirpvde -s /tmp/.X11-unix/`;
    `vde_plug -s /tmp/.X11-unix/`;
  }
}

export class Rom extends HardwareComponent {}
export class Disk extends HardwareComponent {}
