/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import {NumberElement, NumberValueEvent} from "../../../model/NumberElement";
import {TreeNode} from "./TreeNode";
import {ModelElementEvent} from "../../../model/ModelElement";

export class NumberNode extends TreeNode<NumberElement> {
  protected _handleElementEvent(e: ModelElementEvent): void {
    if (e instanceof NumberValueEvent) {
      this._emitChanged(e.remote);
    }
  }
}
