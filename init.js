import { env, exec, readTextFile, writeTextFile } from "./lib/lib.js";

(async () => {
  console.log(env.get("PATH"));
  console.log(JSON.parse(await readTextFile("metadata.json")));
  await writeTextFile("test.txt", "test");
  await exec(["ls", "/"]);
})().catch(console.error);
