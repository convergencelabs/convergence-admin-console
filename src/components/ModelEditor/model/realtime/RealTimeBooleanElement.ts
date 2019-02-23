import {BooleanElement} from "../BooleanElement";
import {ModelPathElement} from "../ModelPath";
import {RealTimeBoolean, BooleanSetValueEvent} from "@convergence-internal/convergence";
import {ContainerElement} from "../ContainterElement";
import {filter} from "rxjs/operators";

export class RealTimeBooleanElement extends BooleanElement {

  private _value: RealTimeBoolean;

  constructor(parent: ContainerElement<any>, value: RealTimeBoolean) {
    super(value.id(), parent);
    this._value = value;
    // TODO unsubscribe
    this._value
      .events()
      .pipe(filter((e: any) => !e.local))
      .subscribe(e => {
        if (e instanceof BooleanSetValueEvent) {
          this._emitValue(true);
          this._emitChange(true);
        }
      });
  }

  public toJSON(): any {
    return this._value;
  }

  public relativePathFromParent(): ModelPathElement {
    const path = this._value.path();
    return path[path.length - 1];
  }

  protected _getValue(): boolean {
    return this._value.value();
  }

  protected _setValue(val: boolean): void {
    this._value.value(val);
  }
}
