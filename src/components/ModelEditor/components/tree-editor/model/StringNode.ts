export class StringNode extends TreeNode<StringElement> {
  constructor(tree: TreeModel, parent: ContainerNode<any> | null, data: StringElement, selected: boolean) {
    super(tree, parent, data, selected);
  }

  protected _handleElementEvent(e: ModelElementEvent): void {
    // FIXME need to emit granular events
    if (e instanceof StringValueEvent) {
      this._emitChanged(e.remote);
    } else if (e instanceof StringInsertEvent) {
      this._emitChanged(e.remote);
    } else if (e instanceof StringRemoveEvent) {
      this._emitChanged(e.remote);
    }
  }
}

import {StringElement, StringValueEvent, StringInsertEvent, StringRemoveEvent} from "../../../model/StringElement";
import {TreeModel} from "./TreeModel";
import {TreeNode} from "./TreeNode";
import {ContainerNode} from "./ContainerNode";
import {ModelElementEvent} from "../../../model/ModelElement";
