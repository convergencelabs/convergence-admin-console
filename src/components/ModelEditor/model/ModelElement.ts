/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import {Observable, Subject} from "rxjs";
import {SapphireEvent} from "../SapphireEvent";
import {ModelPath, ModelPathElement} from "./ModelPath";
import {ContainerElement} from "./ContainterElement";

export abstract class ModelElement<T> {
  private readonly _id: string;
  private readonly _parent: ContainerElement<any> | null;

  private _eventsSubject: Subject<ModelElementEvent>;

  protected constructor(id: string, parent: ContainerElement<any> | null) {
    this._id = id;
    this._parent = parent;
    this._eventsSubject = new Subject();
  }

  public id(): string {
    return this._id;
  }

  public abstract type(): string;

  public depth(): number {
    if (this._parent !== null) {
      return this._parent.depth() + 1;
    } else {
      return 0;
    }
  }

  public elementPath(): ModelElement<any>[] {
    if (this._parent !== null) {
      const path = this._parent.elementPath().slice(0);
      path.push(this);
      return path;
    } else {
      return [this];
    }
  }

  public path(): ModelPath {
    const result: ModelPath = this.elementPath().map(e => e.relativePathFromParent()!);
    result.shift();
    return result;
  }

  public parent(): ContainerElement<any> | null {
    return this._parent;
  }

  public events(): Observable<ModelElementEvent> {
    return this._eventsSubject.asObservable();
  }

  public value(): T
  public value(val?: T): void
  public value(val?: T): T | void {
    if (arguments.length === 0) {
      return this._getValue();
    } else {
      this._setValueAndEmit(val!);
    }
  }

  protected _bubbleChange(remote: boolean = true): void {
    if (this._parent !== null) {
      this._parent._bubbleChange();
    }
  }

  protected _setValueAndEmit(val: T): void {
    this._setValue(val);
    this._emitValue();
    this._emitChange();
  }

  protected _emitChange(remote: boolean = false): void {
    this._eventsSubject.next(new ModelElementChangedEvent(this, remote));
  }

  protected _emit(event: ModelElementEvent): void {
    this._eventsSubject.next(event);
  }

  public abstract relativePathFromParent(): ModelPathElement | null;

  public abstract toJSON(): any;

  protected abstract _emitValue(remote?: boolean): void;

  protected abstract _getValue(): T;

  protected abstract _setValue(val: T): void;
}

export interface ModelElementEvent extends SapphireEvent {
  element: ModelElement<any>;
}

export interface ModelElementMutationEvent extends ModelElementEvent {
  remote: boolean;
}

export class ModelElementChangedEvent implements ModelElementMutationEvent {
  public static NAME: string = "element_changed";
  public name: string = ModelElementChangedEvent.NAME;

  constructor(public element: ModelElement<any>, public remote: boolean) {
    Object.freeze(this);
  }
}
