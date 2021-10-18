import "./lib/debug.js";
import { env, exec, readTextFile, writeTextFile } from "./lib/lib.js";

class Metadata {
  index = {};
  constructor(data) {
    this.data = data;
    this._updateIndex();
  }
  _updateIndex(data = this.data) {
    if (typeof data !== "object") return;
    if (data.id) this.index[data.id] = data;
    for (const value of Object.values(data)) this._updateIndex(value);
  }
  get(id) {
    return this.index[id];
  }
}

class Machine {
  constructor(machine, spec) {
    spec.d;
  }
  addComponent(component, spec) {
    console.debug(component, spec);
  }
  start() {

  }
}

(async () => {
  const metadata = new Metadata(
    JSON.parse(await readTextFile("metadata.json"))
  );
  const config = JSON.parse(env.get("EAAS_CONFIG"));

  const machine = new Machine(metadata, metadata.get(config.machine));
  const hardwareComponents = config.hardwareComponents.sort(
    ({ index: a }, { index: b }) => (a < b ? -1 : a > b ? 1 : 0)
  );
  for (const component of hardwareComponents) {
    machine.addComponent(component, metadata.get(component.component));
  }

  /*
  console.log(env.get("PATH"));
  console.log(JSON.parse(await readTextFile("metadata.json")));
  await writeTextFile("test.txt", "test");
  await exec(["ls", "/"]);
*/
})().catch(console.error);
