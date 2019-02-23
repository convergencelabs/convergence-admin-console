import {ObjectElement} from "../ObjectElement";
import {ModelElement} from "../ModelElement";
import {ModelPathElement} from "../ModelPath";
import {
  RealTimeObject, ObjectSetValueEvent, ObjectSetEvent, ObjectRemoveEvent
} from "@convergence-internal/convergence";
import {createRealTimeModelElement} from "./RealTimeModelElementFactory";
import {ContainerElement} from "../ContainterElement";
import {filter} from "rxjs/operators";

export class RealTimeObjectElement extends ObjectElement {

  private _rtObject: RealTimeObject;
  private _value: Map<string, ModelElement<any>>;

  constructor(parent: ContainerElement<any> | null, value: RealTimeObject) {
    super(value.id(), parent);
    this._value = new Map<string, ModelElement<any>>();
    value.forEach((element, key) => {
      this._value.set(key!, createRealTimeModelElement(this, element))
    });
    this._rtObject = value;

    this._rtObject
      .events()
      .pipe(filter((e: any) => !e.local))
      .subscribe(e => {
        if (e instanceof ObjectSetValueEvent) {
          this._value = new Map<string, ModelElement<any>>();
          this._rtObject.forEach((element, key) => {
            this._value.set(key!, createRealTimeModelElement(this, element))
          });
          this._emitValue(true);
          this._emitChange(true);
        } else if (e instanceof ObjectSetEvent) {
          const rte = this._rtObject.get(e.key);
          const element: ModelElement<any> = createRealTimeModelElement(this, rte);
          this._value.set(e.key, element);
          this._emitSet(e.key, element, true);
          this._emitChange(true);
        } else if (e instanceof ObjectRemoveEvent) {
          this._value.delete(e.key);
          this._emitRemove(e.key, true);
          this._emitChange(true);
        }
      })
  }

  public set(key: string, value: any): void {
    const rte = this._rtObject.set(key, value);
    const element: ModelElement<any> = createRealTimeModelElement(this, rte);
    this._value.set(key, element);
    this._emitSet(key, element);
    this._emitChange();
  }

  public remove(key: string): void {
    this._rtObject.remove(key);
    this._value.delete(key);
    this._emitRemove(key);
    this._emitChange();
  }

  public rename(oldKey: string, newKey: string): void {
    // FIXME replace with move
    this._rtObject.model().startBatch();
    const oldChild = this._rtObject.remove(oldKey);
    const newChild = this._rtObject.set(newKey, oldChild.value());
    this._rtObject.model().endBatch();

    if (!this._value.has(oldKey)) {
      throw new Error(`Object does not have existing key: '${oldKey}'`);
    }

    this._value.delete(oldKey);
    const element: ModelElement<any> = createRealTimeModelElement(this, newChild);
    this._value.set(newKey, element);

    // Fixme replace with move
    this._emitRemove(oldKey, true);
    this._emitSet(newKey, element);
    // this._emitRename(oldKey, newKey);
    this._emitChange();
  }

  public forEach(callback: (key: string, value: ModelElement<any>) => void) {
    this._value.forEach((v: ModelElement<any>, k: string) => callback(k, v));
  }

  public toJSON(): any {
    const result: { [key: string]: any } = {};
    this._value.forEach((v, k) => {
      result[k] = v.toJSON();
    });
    return result;
  }

  public size(): number {
    return this._value.size;
  }

  public hasKey(key: string): boolean {
    return this._value.has(key);
  }

  public relativePathFromParent(): ModelPathElement {
    const path = this._rtObject.path();
    return path[path.length - 1];
  }


  protected _getValue(): { [key: string]: any } {
    const result: { [key: string]: any } = {};
    this._value.forEach((v, k) => {
      result[k] = v.value();
    });
    return result;
  }

  protected _setValue(val: { [key: string]: any }): void {
    this._rtObject.value(val);
    this._value = new Map<string, ModelElement<any>>();
    this._rtObject.forEach((element, key) => {
      this._value.set(key!, createRealTimeModelElement(this, element))
    });
  }
}
