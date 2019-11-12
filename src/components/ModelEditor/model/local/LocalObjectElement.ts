/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import {ObjectElement} from "../ObjectElement";
import {createLocalModelElement} from "./LocalModelElementFactory";
import {ModelElement} from "../ModelElement";
import {ModelPathElement} from "../ModelPath";
import {LocalElement} from "./LocalElement";
import {ContainerElement} from "../ContainterElement";

export class LocalObjectElement extends ObjectElement implements LocalElement {

  private _value: Map<string, ModelElement<any>>;
  private _nextId: number;
  private _fieldInParent: ModelPathElement | null;

  constructor(id: string, parent: ContainerElement<any> | null, fieldInParent: ModelPathElement | null, value: {[key: string]: any}) {
    super(id, parent);
    this._nextId = 0;
    this._value = new Map<string, ModelElement<any>>();
    Object.keys(value).forEach(k => this._value.set(k, this._createElement(value[k], k)));
    this._fieldInParent = fieldInParent;
  }

  public set(key: string, value: any): void {
    const element: ModelElement<any> = this._createElement(value, key);
    this._value.set(key, element);
    this._emitSet(key, element);
    this._emitChange();
  }

  public remove(key: string): void {
    this._value.delete(key);
    this._emitRemove(key);
    this._emitChange();
  }

  public rename(oldKey: string, newKey: string): void {
    const element: ModelElement<any> = this._value.get(oldKey)!;
    if (!this._value.has(oldKey)) {
      throw new Error(`Object does not have existing key: '${oldKey}'`);
    }

    this._value.delete(oldKey);
    this._value.set(newKey, element);
    (element as any as LocalElement)._setFieldInParent(newKey);

    this._emitRename(oldKey, newKey);
    this._emitChange();
  }

  public forEach(callback: (key: string, value: ModelElement<any>) => void) {
    this._value.forEach((v: ModelElement<any>, k: string) => callback(k, v));
  }

  public toJSON(): any {
    const result: {[key: string]: any} = {};
    this._value.forEach((v, k) => {
      result[k] = v.toJSON();
    });
    return result;
  }

  public size(): number {
    return this._value.size;
  }


  public hasKey(key: string): boolean {
    return this._value.get(key) !== undefined;
  }

  public relativePathFromParent(): ModelPathElement | null {
    return this._fieldInParent;
  }

  protected _getValue(): {[key: string]: any} {
    const result: {[key: string]: any} = {};
    this._value.forEach((v, k) => {
      result[k] = v.value();
    });
    return result;
  }

  protected _setValue(val: {[key: string]: any}): void {
    this._value = new Map<string, ModelElement<any>>();
    Object.keys(val).forEach(k => this._value.set(k, this._createElement(val[k], k)));
  }

  private _createElement(value: any, key: string): ModelElement<any> {
    return createLocalModelElement(this._getNextId(), this, key, value);
  }

  private _getNextId(): string {
    return (this._nextId++) + "";
  }

  _setFieldInParent(field: ModelPathElement): void {
    this._fieldInParent = field;
  }
}
