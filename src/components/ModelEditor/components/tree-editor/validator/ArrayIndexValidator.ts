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
