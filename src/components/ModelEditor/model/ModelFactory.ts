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