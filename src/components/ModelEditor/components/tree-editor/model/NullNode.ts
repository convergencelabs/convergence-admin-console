export class NullNode extends TreeNode<NullElement> {
  constructor(tree: TreeModel, parent: ContainerNode<any> | null, data: NullElement, selected: boolean) {
    super(tree, parent, data, selected);
  }

  protected _handleElementEvent(e: ModelElementEvent): void {

  }
}

import {NullElement} from "../../../model/NullElement";
import {TreeModel} from "./TreeModel";
import {TreeNode} from "./TreeNode";
import {ContainerNode} from "./ContainerNode";
import {ModelElementEvent} from "../../../model/ModelElement";
