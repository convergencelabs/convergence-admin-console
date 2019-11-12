/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import {TreeNode} from "../TreeNode";

export class SearchResult {

  private readonly _node: TreeNode<any>;

  constructor(node: TreeNode<any>) {
    this._node = node;
  }

  public getNode(): TreeNode<any> {
    return this._node;
  }

  public activate(): void {
    this._node.setActiveResult(this);
  }

  public deactivate(): void {
    this._node.setActiveResult(null);
  }
}
