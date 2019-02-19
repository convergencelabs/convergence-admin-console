import {DateElement} from "../DateElement";
import {ModelPathElement} from "../ModelPath";
import {LocalElement} from "./LocalElement";
import {ContainerElement} from "../ContainterElement";

export class LocalDateElement extends DateElement implements LocalElement {

  private _value: Date;
  private _fieldInParent: ModelPathElement;

  constructor(id: string, parent: ContainerElement<any>, fieldInParent: ModelPathElement, value: Date) {
    super(id, parent);
    this._value = value;
    this._fieldInParent = fieldInParent;
  }

  public relativePathFromParent(): ModelPathElement {
    return this._fieldInParent;
  }

  public toJSON(): any {
    return {
      $convergenceType: "date",
      value: this._value.toISOString()
    };
  }

  protected _getValue(): Date {
    return this._value;
  }

  protected _setValue(val: Date): void {
    this._value = val;
  }

  _setFieldInParent(field: ModelPathElement): void {
    this._fieldInParent = field;
  }
}
