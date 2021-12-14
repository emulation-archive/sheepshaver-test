class Component {}

export class EaasMachine {
  components = [];
  constructor(machine, spec) {
    spec?.d;
  }
  addComponent(component) {
    this.components.push(component);
    console.debug(component);
    if (component instanceof FrameworkComponent) {
      component.start();
    }
  }
  start() {}
}
export class HardwareComponent extends Component {}
export class FrameworkComponent extends Component {
  run() {}
}
