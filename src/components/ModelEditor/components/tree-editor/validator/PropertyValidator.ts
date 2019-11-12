/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import {ObjectPropertyValidator} from "./ObjectPropertyValidator";
import {ArrayIndexValidator} from "./ArrayIndexValidator";
import {ContainerNode} from "../model/ContainerNode";
import {ObjectNode} from "../model/ObjectNode";
import {ArrayNode} from "../model/ArrayNode";

export type PropertyValidationStatus = "ok" | "warning" | "error";

export interface PropertyValidation {
  status: PropertyValidationStatus;
  message?: string;
}

export const OK_PROPERTY_VALIDATION: PropertyValidation = {status: "ok"};

export class PropertyValidator {
  public static validate(node: ContainerNode<any>, newProperty: string): PropertyValidation {
    if (node instanceof ObjectNode) {
      return ObjectPropertyValidator.validate(node, newProperty);
    } else if (node instanceof ArrayNode) {
      return ArrayIndexValidator.validate(node, newProperty);
    } else {
      throw new Error("Unknown node type: " + node.type());
    }
  }
}
