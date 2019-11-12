/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import {StringElement, StringInsertEvent, StringRemoveEvent, StringValueEvent} from "../../../model/StringElement";
import {TreeNode} from "./TreeNode";
import {ModelElementEvent} from "../../../model/ModelElement";

export class StringNode extends TreeNode<StringElement> {
  protected _handleElementEvent(e: ModelElementEvent): void {
    // FIXME need to emit granular events
    if (e instanceof StringValueEvent) {
      this._emitChanged(e.remote);
    } else if (e instanceof StringInsertEvent) {
      this._emitChanged(e.remote);
    } else if (e instanceof StringRemoveEvent) {
      this._emitChanged(e.remote);
    }
  }
}
