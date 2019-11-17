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

import {ModelElement, ModelElementMutationEvent} from "./ModelElement";
import {ModelElementTypes} from "./ModelElementTypes";
import {ContainerElement} from "./ContainterElement";

export class ObjectElementSetEvent implements ModelElementMutationEvent {
  public static NAME: string = "set";
  public name: string = ObjectElementSetEvent.NAME;

  constructor(public readonly element: ObjectElement,
              public readonly key: string,
              public readonly value: ModelElement<any>,
              public readonly remote: boolean) {
    Object.freeze(this);
  }
}

export class ObjectElementRemoveEvent implements ModelElementMutationEvent {
  public static NAME: string = "remove";
  public name: string = ObjectElementRemoveEvent.NAME;

  constructor(public readonly element: ObjectElement,
              public readonly key: string,
              public readonly remote: boolean) {
    Object.freeze(this);
  }
}

export class ObjectElementRenameEvent implements ModelElementMutationEvent {
  public static NAME: string = "value";
  public name: string = ObjectElementRenameEvent.NAME;

  constructor(public readonly element: ObjectElement,
              public readonly oldKey: string,
              public readonly newKey: string,
              public readonly remote: boolean) {
    Object.freeze(this);
  }
}

export class ObjectElementValueEvent implements ModelElementMutationEvent {
  public static NAME: string = "value";
  public name: string = ObjectElementValueEvent.NAME;

  constructor(public readonly element: ObjectElement,
              public readonly remote: boolean) {
    Object.freeze(this);
  }
}

export abstract class ObjectElement extends ContainerElement<{[key: string]: any}> {

  protected constructor(id: string, parent: ContainerElement<any> | null) {
    super(id, parent);
  }

  public type(): string {
    return ModelElementTypes.OBJECT;
  }

  protected _emitSet(key: string, value: ModelElement<any>, remote: boolean = false): void {
    this._emit(new ObjectElementSetEvent(this, key, value, remote));
    this._bubbleChange(remote);
  }

  protected _emitRemove(key: string, remote: boolean = false): void {
    this._emit(new ObjectElementRemoveEvent(this, key, remote));
    this._bubbleChange(remote);
  }

  protected _emitValue(remote: boolean = false): void {
    this._emit(new ObjectElementValueEvent(this, remote));
    this._bubbleChange(remote);
  }

  protected _emitRename(oldKey: string, newKey: string, remote: boolean = false): void {
    this._emit(new ObjectElementRenameEvent(this, oldKey, newKey, remote));
    this._bubbleChange(remote);
  }

  public abstract hasKey(key: string): boolean;

  public abstract set(key: string, value: any): void;

  public abstract remove(key: string): void;

  public abstract rename(oldKey: string, newKey: string): void;

  public abstract forEach(callback: (key: string, value: ModelElement<any>) => void): void;

  public abstract size(): number;

}
