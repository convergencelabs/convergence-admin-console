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
import {ModelPathElement} from "../ModelPath";
import {LocalElement} from "./LocalElement";
import {ContainerElement} from "../ContainterElement";

export class LocalStringElement extends StringElement implements LocalElement {

  private _value: string;
  private _fieldInParent: ModelPathElement;

  constructor(id: string, parent: ContainerElement<any>, fieldInParent: ModelPathElement, value: string) {
    super(id, parent);
    this._value = value;
    this._fieldInParent = fieldInParent;
  }

  public insert(index: number, value: string): void {
    this._value = this._value.slice(0, index) + value + this._value.slice(index);
    this._emitInsert(index, value);
    this._emitChange();
  }

  public remove(index: number, length: number): void {
    this._value = this._value.slice(0, index) + this._value.slice(index + length);
    this._emitRemove(index, length);
    this._emitChange();
  }

  public toJSON(): any {
    return this._value;
  }

  public relativePathFromParent(): ModelPathElement {
    return this._fieldInParent;
  }

  _setFieldInParent(field: ModelPathElement): void {
    this._fieldInParent = field;
  }

  protected _getValue(): string {
    return this._value;
  }

  protected _setValue(val: string): void {
    this._value = val;
  }
}
