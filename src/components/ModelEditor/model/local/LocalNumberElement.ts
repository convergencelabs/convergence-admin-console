import {NumberElement} from "../NumberElement";
import {ModelPathElement} from "../ModelPath";
import {LocalElement} from "./LocalElement";
import {ContainerElement} from "../ContainterElement";

export class LocalNumberElement extends NumberElement implements LocalElement {

  private _value: number;
  private _fieldInParent: ModelPathElement;

  constructor(id: string, parent: ContainerElement<any>, fieldInParent: ModelPathElement, value: number) {
    super(id, parent);
    this._value = value;
    this._fieldInParent = fieldInParent;
  }

  public delta(delta: number): void {
    this._value = this._value + delta;
    this._emitDelta(delta, false);
  }

  public toJSON(): any {
    return this._value;
  }

  public relativePathFromParent(): ModelPathElement {
    return this._fieldInParent;
  }

  protected _getValue(): number {
    return this._value;
  }

  protected _setValue(val: number): void {
    this._value = val;
  }

  _setFieldInParent(field: ModelPathElement): void {
    this._fieldInParent = field;
  }
}
