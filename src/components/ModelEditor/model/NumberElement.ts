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

export class NumberValueEvent implements ModelElementMutationEvent {
  public static readonly NAME: string = "value";
  public readonly name: string = NumberValueEvent.NAME;
  constructor(public readonly element: NumberElement,
              public readonly remote: boolean) {
    Object.freeze(this);
  }
}

export class NumberDeltaEvent implements ModelElementMutationEvent {
  public static readonly NAME: string = "delta";
  public readonly name: string = NumberDeltaEvent.NAME;
  constructor(public readonly element: NumberElement,
              public readonly delta: number,
              public readonly remote: boolean) {
    Object.freeze(this);
  }
}

export abstract class NumberElement extends ModelElement<number> {
  public type(): string {
    return ModelElementTypes.NUMBER;
  }

  public abstract delta(delta: number): void;

  protected _emitDelta(delta: number, remote: boolean = false): void {
    this._emit(new NumberDeltaEvent(this, delta, remote));
    this._bubbleChange(remote);
  }

  protected _emitValue(remote: boolean = false): void {
    this._emit(new NumberValueEvent(this, remote));
    this._bubbleChange(remote);
  }
}
