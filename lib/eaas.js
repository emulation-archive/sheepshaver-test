class Component {
  addedToMachine(/**@type {EaasMachine}*/ machine) {}
}

export class EaasMachine {
  components = [];
  constructor(machine, spec) {
    spec?.d;
  }
  addComponent(component) {
    this.components.push(component);
    if (component instanceof FrameworkComponent) {
      try {
        component.start();
      } catch (e) {
        console.debug(e);
        throw e;
      }
    }
    component.addedToMachine(this);
  }
  start() {}
}
export class HardwareComponent extends Component {}
export class FrameworkComponent extends Component {
  run() {}
}
