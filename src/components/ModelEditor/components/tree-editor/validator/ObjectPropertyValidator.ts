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

import {ObjectNode} from "../model/ObjectNode";
import {PropertyValidation} from "./PropertyValidator";

export class ObjectPropertyValidator {
  public static validate(node: ObjectNode, key: string): PropertyValidation {
    if (key.trim().length === 0) {
      return {
        status: "warning",
        message: "Property contains only whitespace."
      };
    }

    if (node.element().hasKey(key)) {
      return {
        status: "warning",
        message: "Will overwrite an existing property."
      };
    }

    return {status: "ok"};
  }
}
