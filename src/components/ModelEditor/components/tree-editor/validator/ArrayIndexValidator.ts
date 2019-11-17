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

import {ArrayNode} from "../model/ArrayNode";
import {PropertyValidation} from "./PropertyValidator";

export class ArrayIndexValidator {
  public static validate(node: ArrayNode, indexString: string): PropertyValidation {
    if (indexString.length === 0) {
      return {
        status: "warning",
        message: "Element will be added the beginning of the array."
      };
    }

    const index: number = Number(indexString);
    const length:number = node.element().size();
    if (index > length) {
      return {
        status: "warning",
        message: "Element will be added at the end of the array."
      };
    }

    return {status: "ok"};
  }
}
