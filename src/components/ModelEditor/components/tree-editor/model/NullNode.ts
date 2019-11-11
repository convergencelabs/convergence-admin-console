import {NullElement} from "../../../model/NullElement";
import {TreeNode} from "./TreeNode";
import {ModelElementEvent} from "../../../model/ModelElement";

export class NullNode extends TreeNode<NullElement> {
  protected _handleElementEvent(e: ModelElementEvent): void {

  }
}
