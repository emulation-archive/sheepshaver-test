class Component {}

export class EaasMachine {
  constructor(machine, spec) {
    spec?.d;
  }
  addComponent(component) {
    console.debug(component);
    if (component instanceof FrameworkComponent) {
      component.run();
    }
  }
  start() {}
}
export class HardwareComponent extends Component {}
export class FrameworkComponent extends Component {
  run() {}
}
