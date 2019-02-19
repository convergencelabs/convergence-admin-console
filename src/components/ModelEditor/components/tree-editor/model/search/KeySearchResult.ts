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
