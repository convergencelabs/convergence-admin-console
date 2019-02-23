import {DateElement} from "../DateElement";
import {ModelPathElement} from "../ModelPath";
import {RealTimeDate, DateSetValueEvent} from "@convergence-internal/convergence";
import {ContainerElement} from "../ContainterElement";
import {filter} from "rxjs/operators";

export class RealTimeDateElement extends DateElement {

  private _value: RealTimeDate;

  constructor(parent: ContainerElement<any>, value: RealTimeDate) {
    super(value.id(), parent);
    this._value = value;

    // TODO unsubscribe
    this._value
      .events()
      .pipe(filter((e: any) => !e.local))
      .subscribe(e => {
        if (e instanceof DateSetValueEvent) {
          this._emitValue(true);
          this._emitChange(true);
        }
      });
  }

  public toJSON(): any {
    return this._value.toJSON();
  }

  public relativePathFromParent(): ModelPathElement {
    const path = this._value.path();
    return path[path.length - 1];
  }

  protected _getValue(): Date {
    return this._value.value();
  }

  protected _setValue(val: Date): void {
    this._value.value(val);
  }
}
