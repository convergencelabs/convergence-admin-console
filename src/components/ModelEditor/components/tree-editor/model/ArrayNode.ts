import {
  ArrayElement,
  ArrayInsertEvent,
  ArrayRemoveEvent,
  ArrayReorderEvent,
  ArraySetEvent,
  ArrayValueEvent
} from "../../../model/ArrayElement";
import {ModelElement, ModelElementEvent} from "../../../model/ModelElement";
import {ModelPath, ModelPathElement} from "../../../model/ModelPath";
import {TreeModel} from "./TreeModel";
import {ContainerNode} from "./ContainerNode";
import {TreeNode} from "./TreeNode";
import {createTreeNode} from "./TreeNodeFactory";

export class ArrayNode extends ContainerNode<ArrayElement> {
  private _children: Array<TreeNode<any>>;

  constructor(tree: TreeModel, parent: ContainerNode<any> | null, data: ArrayElement, selected: boolean, expanded: boolean) {
    super(tree, parent, data, selected, expanded);

    this._children = [];
    data.forEach((i: number, v: ModelElement<any>) => this._children.push(createTreeNode(tree, this, v)));
  }

  public size(): number {
    return this.element().size();
  }

  public forEach(callback: (index: number, value: TreeNode<any>) => void) {
    this._children.forEach((value: TreeNode<any>, index: number) => callback(index, value));
  }

  public getNodeAtPath(path: ModelPath): TreeNode<any> | null {
    if (path.length === 0) {
      return this;
    } else {
      const relPath = path.slice(0);
      const key: ModelPathElement = relPath.shift()!;
      if (typeof key === "number") {
        const child: TreeNode<any> = this._children[key as number];
        return child.getNodeAtPath(relPath);
      } else {
        throw new Error("Incorrect elementPath element type for ArrayNode")
      }
    }
  }

  public removeChild(child: TreeNode<any>): void {
    this.element().remove(child.element().relativePathFromParent());
  }

  protected _handleElementEvent(e: ModelElementEvent): void {
    if (e instanceof ArrayInsertEvent) {
      this._children.splice(e.index, 0, createTreeNode(this.tree(), this, e.value));
      this._emitChanged();
    } else if (e instanceof ArraySetEvent) {
      this._children[e.index] = createTreeNode(this.tree(), this, e.value);
      this._emitChanged();
    } else if (e instanceof ArrayRemoveEvent) {
      this._children.splice(e.index, 1);
      this._emitChanged();
    } else if (e instanceof ArrayReorderEvent) {
      const current = this._children[e.from];
      this._children.splice(e.from, 1);
      this._children.splice(e.to, 0, current);
      this._emitChanged();
    } else if (e instanceof ArrayValueEvent) {
      this._children = [];
      this.element().forEach((i: number, v: ModelElement<any>) => this._children.push(createTreeNode(this.tree(), this, v)));
      this._emitChanged();
    }
  }
}
