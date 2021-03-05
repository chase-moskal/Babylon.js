import { DeviceType, PointerInput, DualShockInput, XboxInput, SwitchInput } from "./deviceEnums.js";

/**
 * Type to handle enforcement of inputs
 */
export type DeviceInput<T extends DeviceType> =
    T extends DeviceType.Keyboard | DeviceType.Generic ? number :
    T extends DeviceType.Mouse | DeviceType.Touch ? PointerInput :
    T extends DeviceType.DualShock ? DualShockInput :
    T extends DeviceType.Xbox ? XboxInput :
    T extends DeviceType.Switch ? SwitchInput :
    never;