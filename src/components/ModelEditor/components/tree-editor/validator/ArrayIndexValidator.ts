/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
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
