import {BooleanElement} from "../BooleanElement";
import {ModelPathElement} from "../ModelPath";
import {LocalElement} from "./LocalElement";
import {ContainerElement} from "../ContainterElement";

export class LocalBooleanElement extends BooleanElement implements LocalElement {

  private _value: boolean;
  private _fieldInParent: ModelPathElement;

  constructor(id: string, parent: ContainerElement<any>, fieldInParent: ModelPathElement, value: boolean) {
    super(id, parent);
    this._value = value;
    this._fieldInParent = fieldInParent;
  }

  public toJSON(): any {
    return this._value;
  }

  public relativePathFromParent(): ModelPathElement {
    return this._fieldInParent;
  }

  protected _getValue(): boolean {
    return this._value;
  }

  protected _setValue(val: boolean): void {
    this._value = val;
  }

  _setFieldInParent(field: ModelPathElement): void {
    this._fieldInParent = field;
  }
}
