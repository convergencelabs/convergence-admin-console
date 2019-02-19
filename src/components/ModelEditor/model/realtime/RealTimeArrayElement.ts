import {ArrayElement} from "../ArrayElement";
import {ModelElement} from "../ModelElement";
import {ModelPathElement} from "../ModelPath";
import {
  RealTimeArray, ArraySetValueEvent, ArrayInsertEvent, ArrayReorderEvent,
  ArraySetEvent, ArrayRemoveEvent
} from "@convergence/convergence";
import {createRealTimeModelElement} from "./RealTimeModelElementFactory";
import {ContainerElement} from "../ContainterElement";
import {filter} from "rxjs/operators";

export class RealTimeArrayElement extends ArrayElement {

  private _rtArray: RealTimeArray;
  private _value: Array<ModelElement<any>>;

  constructor(parent: ContainerElement<any>, array: RealTimeArray) {
    super(array.id(), parent);
    this._rtArray = array;
    this._value = [];
    array.forEach((val, index) => {
      this._value.push(createRealTimeModelElement(this, val));
    });

    // FIXME unsubscribe
    this._rtArray
      .events()
      .pipe(filter((e: any) => !e.local))
      .subscribe(e => {
        if (e instanceof ArraySetValueEvent) {
          this._value = [];
          this._rtArray.forEach((val, index) => {
            this._value.push(createRealTimeModelElement(this, val));
          });
          this._emitValue(true);
          this._emitChange(true);
        } else if (e instanceof ArrayInsertEvent) {
          const rte = this._rtArray.get(e.index);
          const element: ModelElement<any> = createRealTimeModelElement(this, rte);
          this._value.splice(e.index, 0, element);
          this._emitInsert(e.index, element, true);
          this._emitChange(true);
        } else if (e instanceof ArraySetEvent) {
          const rte = this._rtArray.get(e.index);
          const element: ModelElement<any> = createRealTimeModelElement(this, rte);
          this._value[e.index] = element;
          this._emitSet(e.index, element, true);
          this._emitChange(true);
        } else if (e instanceof ArrayRemoveEvent) {
          this._value.splice(e.index, 1);
          this._emitRemove(e.index, true);
          this._emitChange(true);
        } else if (e instanceof ArrayReorderEvent) {
          const element = this._value[e.fromIndex];
          this._value.splice(e.fromIndex, 1);
          this._value.splice(e.toIndex, 0, element);
          this._emitReorder(e.fromIndex, e.toIndex, true);
          this._emitChange(true);
        }
      });
  }

  public insert(index: number, value: any): void {
    const rte = this._rtArray.insert(index, value);
    const element: ModelElement<any> = createRealTimeModelElement(this, rte);
    this._value.splice(index, 0, element);
    this._emitInsert(index, element);
    this._emitChange();
  }

  public set(index: number, value: any): void {
    const rte = this._rtArray.set(index, value);
    const element: ModelElement<any> = createRealTimeModelElement(this, rte);
    this._value[index] = element;
    this._emitSet(index, element);
    this._emitChange();
  }

  public remove(index: number): void {
    this._rtArray.remove(index);
    this._value.splice(index, 1);
    this._emitRemove(index);
    this._emitChange();
  }

  public reorder(fromIndex: number, toIndex: number): void {
    this._rtArray.reorder(fromIndex, toIndex);
    const element = this._value[fromIndex];
    this._value.splice(fromIndex, 1);
    this._value.splice(toIndex, 0, element);
    this._emitReorder(fromIndex, toIndex);
    this._emitChange();
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
    const path = this._rtArray.path();
    return path[path.length - 1];
  }

  protected _getValue(): any[] {
    return this._value.map(item => item.value());
  }

  protected _setValue(val: any[]): void {
    this._rtArray.value(val);
    this._value = [];
    this._rtArray.forEach((val, index) => {
      this._value.push(createRealTimeModelElement(this, val));
    });
  }
}