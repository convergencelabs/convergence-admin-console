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

export abstract class ContainerElement<T> extends ModelElement<T> {

  protected constructor(id: string, parent: ContainerElement<any> | null) {
    super(id, parent);
  }

  public _bubbleChange(remote: boolean = true): void {
    this._emit(new ModelSubtreeChangedEvent(this, remote));
    const parent = this.parent();
    if (parent !== null) {
      parent._bubbleChange();
    }
  }
}

export class ModelSubtreeChangedEvent implements ModelElementMutationEvent {
  public static NAME: string = "subtree_changed";
  public name: string = ModelSubtreeChangedEvent.NAME;

  constructor(public readonly element: ModelElement<any>,
              public readonly remote: boolean) {
    Object.freeze(this);
  }
}
