import { Camera } from "../camera.js";
import { PassPostProcess } from "../../PostProcesses/passPostProcess.js";
import { AnaglyphPostProcess } from "../../PostProcesses/anaglyphPostProcess.js";

Camera._setStereoscopicAnaglyphRigMode = function(camera: Camera) {
    camera._rigCameras[0]._rigPostProcess = new PassPostProcess(camera.name + "_passthru", 1.0, camera._rigCameras[0]);
    camera._rigCameras[1]._rigPostProcess = new AnaglyphPostProcess(camera.name + "_anaglyph", 1.0, camera._rigCameras);
};