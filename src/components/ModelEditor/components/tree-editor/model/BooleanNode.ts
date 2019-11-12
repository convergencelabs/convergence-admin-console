/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import {BooleanElement, BooleanValueEvent} from "../../../model/BooleanElement";
import {TreeNode} from "./TreeNode";
import {ModelElementEvent} from "../../../model/ModelElement";

export class BooleanNode extends TreeNode<BooleanElement> {
  protected _handleElementEvent(e: ModelElementEvent): void {
    if (e instanceof BooleanValueEvent) {
      this._emitChanged(e.remote);
    }
  }
}
