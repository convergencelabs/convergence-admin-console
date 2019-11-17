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

export class BooleanValueEvent implements ModelElementMutationEvent {
  public static readonly NAME: string = "value";
  public readonly name: string = BooleanValueEvent.NAME;
  constructor(public readonly element: BooleanElement,
              public readonly remote: boolean) {
    Object.freeze(this);
  }
}

export abstract class BooleanElement extends ModelElement<boolean> {
  protected constructor(id: string, parent: ContainerElement<any>) {
    super(id, parent);
  }

  public type(): string {
    return ModelElementTypes.BOOLEAN;
  }

  protected _emitValue(remote: boolean = false): void {
    this._emit(new BooleanValueEvent(this, remote));
    this._bubbleChange(remote);
  }
}
