/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import {NullElement} from "../../../model/NullElement";
import {TreeNode} from "./TreeNode";
import {ModelElementEvent} from "../../../model/ModelElement";

export class NullNode extends TreeNode<NullElement> {
  protected _handleElementEvent(e: ModelElementEvent): void {

  }
}
