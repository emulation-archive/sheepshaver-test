import { FrameworkComponent } from "./lib/eaas.js";
import { run } from "./lib/lib.js";

export class Xpra extends FrameworkComponent {
    constructor() {
        super();
        console.log("xpra:", new.target.meta);
    }
}