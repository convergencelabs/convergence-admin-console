/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import {ModelElement} from "./ModelElement";
import {ModelElementTypes} from "./ModelElementTypes";
import {ContainerElement} from "./ContainterElement";

export abstract class NullElement extends ModelElement<null> {
  protected constructor(id: string, parent: ContainerElement<any>) {
    super(id, parent);
  }

  public type(): string {
    return ModelElementTypes.NULL;
  }

  protected _emitValue(remote: boolean = false): void {
    throw new Error("Null values can not change their value.");
  }
}
