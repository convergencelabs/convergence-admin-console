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

export class StringInsertEvent implements ModelElementMutationEvent {
  public static readonly NAME: string = "insert";
  public readonly name: string = StringInsertEvent.NAME;
  constructor(public readonly element: StringElement,
              public readonly index: number,
              public readonly value: string,
              public readonly remote: boolean) {
    Object.freeze(this);
  }
}

export class StringRemoveEvent implements ModelElementMutationEvent {
  public static readonly NAME: string = "remove";
  public readonly name: string = StringRemoveEvent.NAME;
  constructor(public readonly element: StringElement,
              public readonly index: number,
              public readonly length: number,
              public readonly remote: boolean) {
    Object.freeze(this);
  }
}

export class StringValueEvent implements ModelElementMutationEvent {
  public static readonly NAME: string = "value";
  public readonly name: string = StringValueEvent.NAME;
  constructor(public readonly element: StringElement,
              public readonly remote: boolean) {
    Object.freeze(this);
  }
}

export abstract class StringElement extends ModelElement<string> {
  public type(): string {
    return ModelElementTypes.STRING;
  }

  protected _emitValue(remote: boolean = false): void {
    this._emit(new StringValueEvent(this, remote));
    this._bubbleChange(remote);
  }

  protected _emitInsert(index: number, value: string, remote: boolean = false): void {
    this._emit(new StringInsertEvent(this, index, value, remote));
    this._bubbleChange(remote);
  }

  protected _emitRemove(index: number, length: number, remote: boolean = false): void {
    this._emit(new StringRemoveEvent(this, index, length, remote));
    this._bubbleChange(remote);
  }

  public abstract insert(index: number, value: string): void;
  public abstract remove(index: number, length: number): void;
}
