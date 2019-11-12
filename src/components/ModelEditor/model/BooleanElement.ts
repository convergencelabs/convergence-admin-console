/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
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
