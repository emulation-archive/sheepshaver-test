import { FrameworkComponent } from "./lib/eaas.js";
import { mkdir, run } from "./lib/lib.js";

export function dirname(path) {
  return path.replace(/\/*[^\/]+\/*$/, "") || ".";
}

export async function waitPath() {}

export class Pulse extends FrameworkComponent {
  env = {};
  get pulsesock() {
    return this.path;
  }
  sinkname = "emu-speaker";
  constructor() {
    // The following PulseAudio options are based on Xpra's get_default_pulseaudio_command().
    // See: https://xpra.org/svn/Xpra/trunk/src/xpra/scripts/config.py
    this.args = [
      "pulseaudio",
      "-n",
      "--start",
      "--daemonize=true",
      "--system=false",
      "--log-level=2",
      "--log-target=stderr",
      "--exit-idle-time=-1",
      "--disable-shm=true",
      "--load=module-suspend-on-idle",
      `--load=module-null-sink sink_name=${this.sinkname} sink_properties=device.description=${this.sinkname}`,
      `--load=module-native-protocol-unix socket=${this.pulsesock} auth-anonymous=1`,
    ];

    // 	echo '==> DONE: PulseAudio-daemon started'

    // 	echo 'Waiting for PulseAudio-daemon to be ready...'
    // 	__wait_until_ready 'PulseAudio-daemon' "${pulsesock}" '10'

    this.env.PULSE_SERVER = this.pulsesock;
  }
}

export class Xpra extends FrameworkComponent {
  display = ":7000";
  xprasock = "/emucon/xpra";
  hasPulse = false;
  constructor() {
    super();

    /* await */ mkdir("/tmp/.X11-unix");

    console.log("xpra:", new.target.meta);
    this.args = [
      "xpra",
      "start",
      this.display,
      ...(this.hasPulse
        ? ["--speaker=disabled", "--pulseaudio=no"]
        : ["--speaker=on", "--pulseaudio=yes"]),
      "--start=sh -c 'xhost +si:localuser:bwfla; touch /tmp/xpra-started'",
      `--socket-dir=${dirname(this.xprasock)}`,
      `--bind=${this.xprasock}`,
      "--microphone=disabled",
      "--notifications=no",
      "--dbus-launch=off",
      "--printing=no",
      "--webcam=off",
      "--daemon=no",
      "--mdns=off",
      "--html=on",
    ];
    console.log(this.args);
  }
  start() {
    console.debug("starting Xpra");
    run({
      cmd: this.args,
    });
  }
}
