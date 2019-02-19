export class NumberNode extends TreeNode<NumberElement> {
  constructor(tree: TreeModel, parent: ContainerNode<any> | null, data: NumberElement, selected: boolean) {
    super(tree, parent, data, selected);
  }

  protected _handleElementEvent(e: ModelElementEvent): void {
    if (e instanceof NumberValueEvent) {
      this._emitChanged(e.remote);
    }
  }
}

import {NumberElement, NumberValueEvent} from "../../../model/NumberElement";
import {TreeModel} from "./TreeModel";
import {TreeNode} from "./TreeNode";
import {ContainerNode} from "./ContainerNode";
import {ModelElementEvent} from "../../../model/ModelElement";
