import {TreeNode} from "../TreeNode";

export class SearchResult {

  private _node: TreeNode<any>;

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
