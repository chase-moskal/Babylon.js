import { Nullable } from "../types.js";

declare type Animation = import("./animation").Animation;

/**
 * Interface containing an array of animations
 */
export interface IAnimatable {
    /**
     * Array of animations
     */
    animations: Nullable<Array<Animation>>;
}