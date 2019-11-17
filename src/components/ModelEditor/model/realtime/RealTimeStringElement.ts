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

import {StringElement} from "../StringElement";
import {RealTimeString, StringInsertEvent, StringRemoveEvent, StringSetValueEvent} from "@convergence/convergence";
import {ModelPathElement} from "../ModelPath";
import {ContainerElement} from "../ContainterElement";
import {filter} from "rxjs/operators";

export class RealTimeStringElement extends StringElement {

  private _value: RealTimeString;

  constructor(parent: ContainerElement<any>, value: RealTimeString) {
    super(value.id(), parent);
    this._value = value;

    // TODO unsubscribe
    this._value
      .events()
      .pipe(filter((e: any) => !e.local))
      .subscribe(e => {
        if (e instanceof StringSetValueEvent) {
          this._emitValue(true);
        } else if (e instanceof StringInsertEvent) {
          this._emitInsert(e.index, e.value, true);
        } else if (e instanceof StringRemoveEvent) {
          this._emitRemove(e.index, e.value.length, true);
        }
      });
  }

  public insert(index: number, value: string): void {
    this._value.insert(index, value);
    this._emitInsert(index, value);
    this._emitChange();
  }

  public remove(index: number, length: number): void {
    this._value.remove(index, length);
    this._emitRemove(index, length);
    this._emitChange();
  }

  public toJSON(): any {
    return this._value;
  }

  public relativePathFromParent(): ModelPathElement {
    const path = this._value.path();
    return path[path.length - 1];
  }

  protected _getValue(): string {
    return this._value.value();
  }

  protected _setValue(val: string): void {
    this._value.value(val);
  }
}
