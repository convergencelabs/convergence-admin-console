/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import {NullElement} from "../NullElement";
import {ModelPathElement} from "../ModelPath";
import {RealTimeNull} from "@convergence/convergence";
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
