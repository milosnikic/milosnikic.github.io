import { UserInterface } from "./user-interface.js";
const ui = new UserInterface();
function loop() {
    ui.draw();
    requestAnimationFrame(loop);
}
loop();
