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

import {BooleanElement} from "../BooleanElement";
import {ModelPathElement} from "../ModelPath";
import {BooleanSetValueEvent, RealTimeBoolean} from "@convergence/convergence";
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
