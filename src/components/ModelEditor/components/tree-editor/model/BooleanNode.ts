export class BooleanNode extends TreeNode<BooleanElement> {
  constructor(tree: TreeModel, parent: ContainerNode<any> | null, data: BooleanElement, selected: boolean) {
    super(tree, parent, data, selected);
  }

  protected _handleElementEvent(e: ModelElementEvent): void {
    if (e instanceof BooleanValueEvent) {
      this._emitChanged(e.remote);
    }
  }
}

import {BooleanElement, BooleanValueEvent} from "../../../model/BooleanElement";
import {TreeModel} from "./TreeModel";
import {TreeNode} from "./TreeNode";
import {ContainerNode} from "./ContainerNode";
import {ModelElementEvent} from "../../../model/ModelElement";
