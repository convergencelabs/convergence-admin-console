import {ModelElement} from "../ModelElement";
import {RealTimeArrayElement} from "./RealTimeArrayElement";
import {RealTimeNullElement} from "./RealTimeNullElement";
import {RealTimeNumberElement} from "./RealTimeNumberElement";
import {RealTimeBooleanElement} from "./RealTimeBooleanElement";
import {RealTimeStringElement} from "./RealTimeStringElement";
import {RealTimeObjectElement} from "./RealTimeObjectElement";
import {RealTimeDateElement} from "./RealTimeDateElement";
import {
  RealTimeElement, RealTimeArray, RealTimeNull, RealTimeNumber, RealTimeBoolean,
  RealTimeDate, RealTimeString, RealTimeObject
} from "@convergence-internal/convergence";
import {ContainerElement} from "../ContainterElement";

export function createRealTimeModelElement(parent: ContainerElement<any>, value: RealTimeElement<any>): ModelElement<any> {
  if (value instanceof RealTimeArray) {
    return new RealTimeArrayElement(parent, value);
  } else if (value instanceof RealTimeNull) {
    return new RealTimeNullElement(parent, value);
  } else if (value instanceof RealTimeNumber) {
    return new RealTimeNumberElement(parent, value);
  } else if (value instanceof RealTimeBoolean) {
    return new RealTimeBooleanElement(parent, value);
  } else if (value instanceof RealTimeString) {
    return new RealTimeStringElement(parent, value);
  } else if (value instanceof RealTimeDate) {
    return new RealTimeDateElement(parent, value);
  } else if (value instanceof RealTimeObject) {
    return new RealTimeObjectElement(parent, value);
  } else {
    throw new Error("invalid model element");
  }
}
