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
