import {NullElement} from "../NullElement";
import {ModelPathElement} from "../ModelPath";
import {LocalElement} from "./LocalElement";
import {ContainerElement} from "../ContainterElement";

export class LocalNullElement extends NullElement implements LocalElement {
  private _fieldInParent: ModelPathElement;

  constructor(id: string, parent: ContainerElement<any>, fieldInParent: ModelPathElement) {
    super(id, parent);
    this._fieldInParent = fieldInParent;
  }

  public toJSON(): any {
    return null;
  }

  public relativePathFromParent(): ModelPathElement {
    return this._fieldInParent;
  }

  protected _getValue(): null {
    return null;
  }

  protected _setValue(val: null): void {
    throw Error("Can not set the value of a NullData");
  }

  _setFieldInParent(field: ModelPathElement): void {
    this._fieldInParent = field;
  }
}
