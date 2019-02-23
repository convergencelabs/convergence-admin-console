import {NumberElement} from "../NumberElement";
import {ModelPathElement} from "../ModelPath";
import {RealTimeNumber, NumberSetValueEvent, NumberDeltaEvent} from "@convergence-internal/convergence";
import {ContainerElement} from "../ContainterElement";
import {filter} from "rxjs/operators";

export class RealTimeNumberElement extends NumberElement {

  private _value: RealTimeNumber;

  constructor(parent: ContainerElement<any>, value: RealTimeNumber) {
    super(value.id(), parent);
    this._value = value;

    // TODO unsubscribe
    this._value
      .events()
      .pipe(filter((e: any) => !e.local))
      .subscribe(e => {
        if (e instanceof NumberSetValueEvent) {
          this._emitValue(true);
          this._emitChange(true);
        } else if (e instanceof NumberDeltaEvent) {
          this._emitDelta(e.value, true);
          this._emitChange(true);
        }
      });
  }

  public delta(delta: number): void {
    this._value.add(delta);
    this._emitDelta(delta);
  }

  public toJSON(): any {
    return this._value;
  }

  public relativePathFromParent(): ModelPathElement {
    const path = this._value.path();
    return path[path.length - 1];
  }

  protected _getValue(): number {
    return this._value.value();
  }

  protected _setValue(val: number): void {
    this._value.value(val);
  }
}
