import {ModelPathElement} from "../ModelPath";

export interface LocalElement {
   _setFieldInParent(relPath: ModelPathElement): void;
}