export class Metadata {
  index = {};
  constructor(data, modules) {
    this.data = data;
    this.modules = modules;
    this._updateIndex();
  }
  _updateIndex(data = this.data) {
    if (typeof data !== "object") return;
    if (data.id) this.index[data.id] = data;
    if (data.superClass) {
      const superClass = this.modules.find((module) => module[data.superClass])[
        data.superClass
      ];
      if (superClass) {
        data.class = class extends superClass {
          static meta = data;
          meta = data;
        };
      }
    }
    for (const value of Object.values(data)) this._updateIndex(value);
  }
  get(id) {
    return this.index[id];
  }
  construct(id, ...args) {
    try {
      const targetClass = this.get(id).class;
      return new targetClass(...args);
    } catch (e) {
      throw new Error(`Cannot create ${JSON.stringify([id, ...args])}`, {
        cause: e,
      });
    }
  }
}
