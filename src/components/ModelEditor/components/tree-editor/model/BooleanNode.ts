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
