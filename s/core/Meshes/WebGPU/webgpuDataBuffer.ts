import { DataBuffer } from "../dataBuffer.js";
import { Nullable } from "../../types.js";

/** @hidden */
export class WebGPUDataBuffer extends DataBuffer {
    private _buffer: Nullable<GPUBuffer>;

    public constructor(resource: GPUBuffer) {
        super();
        this._buffer = resource;
    }

    public get underlyingResource(): any {
        return this._buffer;
    }
}