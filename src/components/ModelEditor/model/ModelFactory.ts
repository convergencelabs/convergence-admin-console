import {RealTimeObject} from "@convergence/convergence";
import {ObjectElement} from "./ObjectElement";
import {LocalObjectElement} from "./local/LocalObjectElement";
import {RealTimeObjectElement} from "./realtime/RealTimeObjectElement";

export type ModelRoot = {[key: string]: any} | RealTimeObject;

export function createTreeElementRoot(data: ModelRoot): ObjectElement {
  if (data instanceof RealTimeObject) {
    return new RealTimeObjectElement(null, data);
  } else if (data.constructor === Object) {
    return new LocalObjectElement("root", null, null, data);
  } else {
    throw new Error("The model root must be either a RealTimeObject or plain JavaScript Object");
  }
}