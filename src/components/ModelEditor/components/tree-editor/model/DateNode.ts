/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import {DateElement, DateValueEvent} from "../../../model/DateElement";
import {TreeNode} from "./TreeNode";
import {ModelElementEvent} from "../../../model/ModelElement";

export class DateNode extends TreeNode<DateElement> {
  protected _handleElementEvent(e: ModelElementEvent): void {
    if (e instanceof DateValueEvent) {
      this._emitChanged(e.remote);
    }
  }
}
