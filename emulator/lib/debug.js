const d = (v) => (console.debug(v), v);
Object.defineProperty(Object.prototype, "d", {
  get() {
    return d(this.valueOf());
  },
});
