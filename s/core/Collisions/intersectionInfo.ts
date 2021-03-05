import { Nullable } from "../types.js";

/**
 * @hidden
 */
export class IntersectionInfo {
    public faceId = 0;
    public subMeshId = 0;

    constructor(
        public bu: Nullable<number>,
        public bv: Nullable<number>,
        public distance: number) {
    }
}
