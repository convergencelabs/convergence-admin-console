/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import {SearchResult} from "./SearchResult";
import {TreeNode} from "../TreeNode";

export class KeySearchResult extends SearchResult {
  private readonly _start: number;
  private readonly _end: number;

  constructor(node: TreeNode<any>, start: number, end: number) {
    super(node);
    this._start = start;
    this._end = end;
  }

  public start(): number {
    return this._start;
  }

  public end(): number {
    return this._end;
  }
}
