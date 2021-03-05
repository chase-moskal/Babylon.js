import { DomManagement } from "./domManagement.js";

/**
 * Class used to provide helper for timing
 */
export class TimingTools {
    /**
     * Polyfill for setImmediate
     * @param action defines the action to execute after the current execution block
     */
    public static SetImmediate(action: () => void) {
        if (DomManagement.IsWindowObjectExist() && window.setImmediate) {
            window.setImmediate(action);
        } else {
            setTimeout(action, 1);
        }
    }
}