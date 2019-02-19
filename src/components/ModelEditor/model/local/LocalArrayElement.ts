import {ArrayElement} from "../ArrayElement";
import {createLocalModelElement} from "./LocalModelElementFactory";
import {ModelElement} from "../ModelElement";
import {ModelPathElement} from "../ModelPath";
import {LocalElement} from "./LocalElement";
import {ContainerElement} from "../ContainterElement";

export class LocalArrayElement extends ArrayElement implements LocalElement {

  private _nextId: number;
  private _value: Array<ModelElement<any>>;
  private _fieldInParent: ModelPathElement;

  constructor(id: string, parent: ContainerElement<any>, fieldInParent: ModelPathElement, value: any[]) {
    super(id, parent);
    this._nextId = 0;
    this._value = value.map((val, index) => this._createElement(val, index));
    this._fieldInParent = fieldInParent;
  }

  public insert(index: number, value: any): void {
    const element: ModelElement<any> = this._createElement(value, index);
    this._value.splice(index, 0, element);
    this._resetIndices(index);
    this._emitInsert(index, element);
    this._emitChange();
  }

  public set(index: number, value: any): void {
    const element: ModelElement<any> = this._createElement(value, index);
    this._value[index] = element;
    this._resetIndices(index);
    this._emitSet(index, element);
    this._emitChange();
  }

  public remove(index: number): void {
    this._value.splice(index, 1);
    this._resetIndices(index);
    this._emitRemove(index);
    this._emitChange();
  }

  public reorder(fromIndex: number, toIndex: number): void {
    const element = this._value[fromIndex];
    this._value.splice(fromIndex, 1);
    this._value.splice(toIndex, 0, element);
    this._resetIndices(Math.min(fromIndex, toIndex), Math.max(fromIndex, toIndex));
    this._emitReorder(fromIndex, toIndex);
    this._emitChange();
  }

  private _resetIndices(start: number, end?: number) {
    end = end || this._value.length - 1;
    for(let i = start; i <= end; i++) {
      const el = this._value[i] as any as LocalElement;
      el._setFieldInParent(i);
    }
  }

  public forEach(callback: (index: number, value: ModelElement<any>) => void) {
    this._value.forEach((value: ModelElement<any>, index: number) => callback(index, value));
  }

  public toJSON(): any {
    return this._value.map(item => item.toJSON());
  }

  public size(): number {
    return this._value.length;
  }

  public relativePathFromParent(): ModelPathElement {
    return this._fieldInParent;
  }

  protected _getValue(): any[] {
    return this._value.map(item => item.value());
  }

  protected _setValue(val: any[]): void {
    this._value = val.map((val, index) => this._createElement(val, index));
  }

  private _createElement(value: any, index: number): ModelElement<any> {
    return createLocalModelElement(this._getNextId(), this, index, value);
  }

  private _getNextId(): string {
    return this._nextId++ + "";
  }

  _setFieldInParent(field: ModelPathElement): void {
    this._fieldInParent = field;
  }
}