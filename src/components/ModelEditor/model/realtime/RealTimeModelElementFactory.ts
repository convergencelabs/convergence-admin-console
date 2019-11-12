/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import {ModelElement} from "../ModelElement";
import {RealTimeArrayElement} from "./RealTimeArrayElement";
import {RealTimeNullElement} from "./RealTimeNullElement";
import {RealTimeNumberElement} from "./RealTimeNumberElement";
import {RealTimeBooleanElement} from "./RealTimeBooleanElement";
import {RealTimeStringElement} from "./RealTimeStringElement";
import {RealTimeObjectElement} from "./RealTimeObjectElement";
import {RealTimeDateElement} from "./RealTimeDateElement";
import {
  RealTimeArray,
  RealTimeBoolean,
  RealTimeDate,
  RealTimeElement,
  RealTimeNull,
  RealTimeNumber,
  RealTimeObject,
  RealTimeString
} from "@convergence/convergence";
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
