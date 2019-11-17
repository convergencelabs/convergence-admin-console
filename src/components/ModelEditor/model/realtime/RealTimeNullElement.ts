/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is part of the Convergence Server, which is released under
 * the terms of the GNU General Public License version 3 (GPLv3). A copy
 * of the GPLv3 should have been provided along with this file, typically
 * located in the "LICENSE" file, which is part of this source code package.
 * Alternatively, see <https://www.gnu.org/licenses/gpl-3.0.html> for the
 * full text of the GPLv3 license, if it was not provided.
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
