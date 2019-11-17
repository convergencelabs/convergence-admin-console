/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is part of the Convergence Server, which is released under
 * the terms of the GNU General Public License version 3 (GPLv3). A copy
 * of the GPLv3 should have been provided along with this file, typically
 * located in the "LICENSE" file, which is part of this source code package.
 * Alternatively, see <https://www.gnu.org/licenses/gpl-3.0.html> for the
 * full text of the GPLv3 license, if it was not provided.
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
