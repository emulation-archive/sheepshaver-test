import "./lib/debug.js";
import {
  env,
  execSync,
  readTextFile,
  writeTextFile,
  run,
  timeout,
  JsonRpcServer,
} from "./lib/lib.js";
import { Metadata } from "./lib/internal-eaas.js";

import * as framework from "./framework.js";
import * as emulator from "./emulator.js";
import * as std from "std";

const compareIndex = ({ index: a }, { index: b }) =>
  a < b ? -1 : a > b ? 1 : 0;

(async () => {
  const metadata = new Metadata(
    JSON.parse(await readTextFile("metadata.json")),
    [emulator, framework]
  );

  const methods = {
    add1(x) {
      return x + 1;
    },
    getMethods() {
      return Object.keys(methods);
    },
    getMetadata() {
      return metadata; 
    }
  };

  new JsonRpcServer(methods).serve(std.in);

  const config = JSON.parse(env.get("EAAS_CONFIG"));
  console.log(config);

  const machine = metadata.construct(config.machine, config);

  const frameworkComponents = config.frameworkComponents.sort(compareIndex);
  const hardwareComponents = config.hardwareComponents.sort(compareIndex);

  for (const component of frameworkComponents) {
    machine.addComponent(metadata.construct(component.component, component));
  }
  for (const component of hardwareComponents) {
    machine.addComponent(metadata.construct(component.component, component));
  }

  console.debug(await machine.start());

  /*
  const process = run({cmd: ["sh", "-c", "kill $$"]});
  await timeout(1000);
  process.kill("SIGTERM");
  console.debug(await process.done);
  */
  /*
  console.log(env.get("PATH"));
  console.log(JSON.parse(await readTextFile("metadata.json")));
  await writeTextFile("test.txt", "test");
  await execSync(["ls", "/"]);
*/
})().catch(console.error);
