import {Subscription} from "rxjs";
import {TreeNode} from "./TreeNode";
import {TreeModel, TreeModelCollapseAllEvent, TreeModelExpandAllEvent, TreeModelExpandToEvent} from "./TreeModel";
import {ModelElement} from "../../../model/ModelElement";
import {SapphireEvent} from "../../../SapphireEvent";

export class NodeExpandedEvent implements SapphireEvent {
  public static readonly NAME: string = "expanded";
  public name: string = NodeExpandedEvent.NAME;

  constructor(public node: ContainerNode<any>) {
    Object.freeze(this);
  }
}

export class NodeCollapsedEvent implements SapphireEvent {
  public static readonly NAME: string = "collapsed";
  public name: string = NodeCollapsedEvent.NAME;

  constructor(public node: ContainerNode<any>) {
    Object.freeze(this);
  }
}

export class NewNodeStateEvent implements SapphireEvent {
  public static readonly NAME: string = "new_node";
  public name: string = NodeCollapsedEvent.NAME;

  constructor(public node: ContainerNode<any>,
              public type: string | null) {
    Object.freeze(this);
  }
}

export abstract class ContainerNode<T extends ModelElement<any>> extends TreeNode<T> {

  private _expanded: boolean;
  private _adding: string | null;
  private _treeSubscription: Subscription;

  protected constructor(tree: TreeModel, parent: ContainerNode<any> | null, data: T, selected: boolean, expanded: boolean) {
    super(tree, parent, data, selected);

    this._expanded = expanded;
    this._adding = null;

    this._treeSubscription = tree.events()
      .subscribe(e => {
        if (e instanceof TreeModelExpandAllEvent) {
          this.expand();
        } else if (e instanceof TreeModelExpandToEvent) {
          if (this.depth() < e.depth) {
            this.expand();
          } else {
            this.collapse();
          }
        } else if (e instanceof TreeModelCollapseAllEvent) {
          this.collapse();
        }
      });
  }

  public isExpanded(): boolean {
    return this._expanded;
  }

  public toggleExpanded(): void {
    if (this._expanded) {
      this.collapse();
    } else {
      this.expand();
    }
  }

  public setAdding(type: string | null): void {
    if (this._adding === type) {
      return;
    }

    this._adding = type;

    this._emit(new NewNodeStateEvent(this, type));

  }

  public expand(): void {
    const oldValue = this._expanded;
    this._expanded = true;
    if (!oldValue) {
      this._emit(new NodeExpandedEvent(this));
    }
  }

  public collapse(): void {
    const oldValue = this._expanded;
    this._expanded = false;
    if (oldValue) {
      this._emit(new NodeCollapsedEvent(this));
    }
  }

  public dispose() {
    super.dispose();
    this._treeSubscription.unsubscribe();
  }

  public abstract removeChild(child: TreeNode<any>): void;
}
