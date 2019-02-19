export class DateNode extends TreeNode<DateElement> {
  constructor(tree: TreeModel, parent: ContainerNode<any> | null, data: DateElement, selected: boolean) {
    super(tree, parent, data, selected);
  }

  protected _handleElementEvent(e: ModelElementEvent): void {
    if (e instanceof DateValueEvent) {
      this._emitChanged(e.remote);
    }
  }
}

import {DateElement, DateValueEvent} from "../../../model/DateElement";
import {TreeModel} from "./TreeModel";
import {TreeNode} from "./TreeNode";
import {ContainerNode} from "./ContainerNode";
import {ModelElementEvent} from "../../../model/ModelElement";
