import {NullElement} from "../NullElement";
import {ModelPathElement} from "../ModelPath";
import {RealTimeNull} from "@convergence-internal/convergence";
import {ContainerElement} from "../ContainterElement";

export class RealTimeNullElement extends NullElement {
  private _value: RealTimeNull;

  constructor(parent: ContainerElement<any>, value: RealTimeNull) {
    super(value.id(), parent);
    this._value = value;
  }

  public toJSON(): any {
    return null;
  }

  public relativePathFromParent(): ModelPathElement {
    const path = this._value.path();
    return path[path.length - 1];
  }

  protected _getValue(): null {
    return null;
  }

  protected _setValue(val: null): void {
    throw Error("Can not set the value of a NullData");
  }
}
