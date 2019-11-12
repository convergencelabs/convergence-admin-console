/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
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
