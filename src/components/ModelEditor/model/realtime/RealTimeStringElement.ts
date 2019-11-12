/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
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
