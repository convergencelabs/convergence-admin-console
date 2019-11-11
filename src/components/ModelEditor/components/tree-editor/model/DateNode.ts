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
