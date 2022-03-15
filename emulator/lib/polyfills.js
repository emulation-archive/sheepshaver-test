if (!console.error) console.error = console.log;

if (!console.debug)
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

if (!String(new Error("")).includes("\n")) Error.prototype.toString = function () {
  return `${this.name}: ${this.message}\n${this.stack}`.trim();
};

if (!new globalThis.Error("", { cause: true }).cause) {
  globalThis.Error = new Proxy(globalThis.Error, {
    construct(target, argArray, newTarget) {
      const ret = Reflect.construct(target, argArray, newTarget);
      if ("cause" in (argArray[1] ?? {})) {
        ret.cause = argArray[1].cause;
      }
      return ret;
    },
  });
  globalThis.Error.prototype.toString = new Proxy(
    globalThis.Error.prototype.toString,
    {
      apply(target, thisArg, argArray) {
        const ret = Reflect.apply(target, thisArg, argArray);
        if (!("cause" in thisArg)) return ret;
        return `${ret}\nCause: ${thisArg.cause}`.trim();
      },
    }
  );
}
