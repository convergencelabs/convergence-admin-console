import {ModelElement} from "../ModelElement";
import {LocalArrayElement} from "./LocalArrayElement";
import {LocalNullElement} from "./LocalNullElement";
import {LocalNumberElement} from "./LocalNumberElement";
import {LocalBooleanElement} from "./LocalBooleanElement";
import {LocalStringElement} from "./LocalStringElement";
import {LocalObjectElement} from "./LocalObjectElement";
import {ModelPathElement} from "../ModelPath";
import {LocalDateElement} from "./LocalDateElement";
import {ContainerElement} from "../ContainterElement";

export function createLocalModelElement(id: string, parent: ContainerElement<any>, filedInParent: ModelPathElement, value: any): ModelElement<any> {
  if (Array.isArray(value)) {
    return new LocalArrayElement(id, parent, filedInParent, value);
  } else if (value === null) {
    return new LocalNullElement(id, parent, filedInParent);
  } else if (typeof value === 'number') {
    return new LocalNumberElement(id, parent, filedInParent,  value);
  } else if (typeof value === 'boolean') {
    return new LocalBooleanElement(id, parent, filedInParent,  value);
  } else if (typeof value === 'string') {
    return new LocalStringElement(id, parent, filedInParent,  value);
  } else if (value instanceof Date) {
    return new LocalDateElement(id, parent, filedInParent, value);
  } else if (value.constructor === Object) {
    const convergeneType = value["$convergenceType"];
    if (convergeneType === undefined) {
      return new LocalObjectElement(id, parent, filedInParent,  value);
    }

    switch (convergeneType) {
      case "date":
        return new LocalDateElement(id, parent, filedInParent, new Date(value.value));
      default:
        throw new Error("Unknow custom type: " + convergeneType);
    }
  } else {
    throw new Error(`Unknown type: ${value.constructor}`);
  }
}
