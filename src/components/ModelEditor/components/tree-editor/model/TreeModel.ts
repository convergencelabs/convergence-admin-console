import {SapphireEvent} from "../../../SapphireEvent";
import {Observable, Subject} from "rxjs";
import {SubtreeChangedEvent, TreeNode} from "./TreeNode";
import {ModelPath, ModelPathElement} from "../../../model/ModelPath";
import {ContainerNode} from "./ContainerNode";
import {ObjectNode} from "./ObjectNode";
import {SearchManager} from "./search/SearchManager";

export interface TreeEvents {
  readonly SELECTION_CHANGED: string;
  readonly EXPAND_ALL: string;
  readonly EXPAND_TO: string;
  readonly EXPAND_PATH: string;
  readonly COLLAPSE_ALL: string;
  readonly SELECTABLE: string;
}

export interface TreeModelEvent extends SapphireEvent {
  readonly tree: TreeModel;
}

export class TreeModelSelectionEvent implements TreeModelEvent {
  public static NAME: string = "selection_changed";
  public name: string = TreeModelSelectionEvent.NAME;

  constructor(public readonly tree: TreeModel,
              public readonly node: TreeNode<any>) {
    Object.freeze(this);
  }
}

export class TreeModelExpandAllEvent implements TreeModelEvent {
  public static NAME: string = "expand_all";
  public name: string = TreeModelExpandAllEvent.NAME;

  constructor(public readonly tree: TreeModel) {
    Object.freeze(this);
  }
}

export class TreeModelExpandToEvent implements TreeModelEvent {
  public static NAME: string = "expand_to";
  public name: string = TreeModelExpandToEvent.NAME;

  constructor(public readonly tree: TreeModel,
              public readonly depth: number) {
    Object.freeze(this);
  }
}

export class TreeModelExpandPathEvent implements TreeModelEvent {
  public static NAME: string = "expand_path";
  public name: string = TreeModelExpandPathEvent.NAME;

  constructor(public readonly tree: TreeModel,
              public path: ModelPath) {
    Object.freeze(this);
  }
}

export class TreeModelCollapseAllEvent implements TreeModelEvent {
  public static NAME: string = "collapse_all";
  public name: string = TreeModelCollapseAllEvent.NAME;

  constructor(public readonly tree: TreeModel) {
    Object.freeze(this);
  }
}

export class TreeModelSelectableEvent implements TreeModelEvent {
  public static NAME: string = "selectable";
  public name: string = TreeModelCollapseAllEvent.NAME;

  constructor(public readonly tree: TreeModel,
              public readonly selectable: boolean) {
    Object.freeze(this);
  }
}

export class TreeModelEditableEvent implements TreeModelEvent {
  public static NAME: string = "editable";
  public name: string = TreeModelEditableEvent.NAME;

  constructor(public readonly tree: TreeModel,
              public readonly editable: boolean) {
    Object.freeze(this);
  }
}

export class TreeModelAddNodeEvent implements TreeModelEvent {
  public static NAME: string = "add_node";
  public name: string = TreeModelAddNodeEvent.NAME;

  constructor(public readonly tree: TreeModel,
              public readonly adding: boolean,
              public readonly parent: TreeNode<any> | null) {
    Object.freeze(this);
  }
}

export interface TreeModelOptions {
  confirmDelete?: (element: TreeNode<any>) => Promise<boolean>;
  editable?: boolean;
}

export class TreeModel {

  public static readonly Events: TreeEvents = {
    SELECTION_CHANGED: TreeModelSelectionEvent.NAME,
    SELECTABLE: TreeModelSelectableEvent.NAME,
    EXPAND_ALL: TreeModelExpandAllEvent.NAME,
    EXPAND_TO: TreeModelExpandToEvent.NAME,
    EXPAND_PATH: TreeModelExpandPathEvent.NAME,
    COLLAPSE_ALL: TreeModelCollapseAllEvent.NAME
  };

  private _selectedNode: TreeNode<any> | null;
  private _selectable: boolean;
  private _addingNode: ContainerNode<any> | null;
  private _eventSubject: Subject<TreeModelEvent>;
  private _root: ObjectNode | null;
  private readonly _confirmDelete?: (element: TreeNode<any>) => Promise<boolean>;
  private _editable: boolean;
  private readonly _searchManager: SearchManager;

  constructor(options: TreeModelOptions) {
    this._root = null;
    this._eventSubject = new Subject();
    this._selectedNode = null;
    this._addingNode = null;
    this._selectable = true;
    this._confirmDelete = options.confirmDelete;
    this._editable = options.editable || false;
    this._searchManager = new SearchManager(this, {caseSensitive: false});
  }

  public setRoot(root: ObjectNode) {
    this._root = root;
    this._root.events().subscribe(e => {
      if (e instanceof SubtreeChangedEvent) {
        this._searchManager.update();
      }
    });
  }

  public root(): ObjectNode | null {
    return this._root;
  }

  public isEditable(): boolean {
    return this._editable;
  }

  public setEditable(editable: boolean): void {
    const oldValue: boolean = this._editable;
    this._editable = editable;

    if (oldValue !== this._editable) {
      this._eventSubject.next(new TreeModelEditableEvent(this, editable));
    }
  }

  public getSearchManager(): SearchManager {
    return this._searchManager;
  }

  public getSelection(): TreeNode<any> | null {
    return this._selectedNode;
  }

  public getNodeAtPath(modelPath: ModelPath): TreeNode<any> | null {
    return this._root!.getNodeAtPath(modelPath);
  }

  public selectNode(node: TreeNode<any> | null): void {
    if (this._selectedNode === node || this._addingNode !== null) {
      return;
    }

    if (this._selectedNode) {
      this._selectedNode._setSelected(false);
    }

    this._selectedNode = node;

    if (this._selectedNode) {
      this._selectedNode._setSelected(true);
    }

    if (node !== null) {
      this._eventSubject.next(new TreeModelSelectionEvent(this, node));
    }
  }

  public setSelectable(selectable: boolean): void {
    if (this._selectable === selectable) {
      return;
    }

    this._selectable = selectable;
    this._eventSubject.next(new TreeModelSelectableEvent(this, selectable));
  }

  public isSelectable(): boolean {
    return this._selectable;
  }

  public addToSelectedNode(type: string): void {
    if (this._selectedNode instanceof ContainerNode) {
      this._setAddingNode(this._selectedNode, type)
    }
  }

  public deleteSelectedNode(): void {
    if (this._selectedNode !== null) {
      return this.deleteNode(this._selectedNode);
    }
  }

  public deleteNode(node: TreeNode<any>): void {
    if (!node) {
      return;
    }

    if (node === this._root) {
      throw new Error("Cannot delete the root node");
    }

    const executeDelete = (typeof this._confirmDelete === "function") ?
      this._confirmDelete(node) :
      Promise.resolve(true);

    executeDelete.then(confirmed => {
      if (confirmed) {
        const parentNode = node.parent();
        parentNode!.removeChild(node);
        this.selectNode(parentNode);
      }
    });
  }

  public clearAddingNode(): void {
    this._setAddingNode(null, null);
  }

  public isAddingNode(): boolean {
    return this._addingNode !== null;
  }

  private _setAddingNode(node: ContainerNode<any> | null, type: string | null): void {
    if (this._addingNode === node) {
      return;
    }

    if (this._addingNode) {
      this._addingNode.setAdding(null);
    }

    this._addingNode = node;

    if (this._addingNode) {
      this._addingNode.setAdding(type);
      this._addingNode.expand();
      this.setSelectable(false);
    } else {
      this.setSelectable(true);
    }

    this._eventSubject.next(new TreeModelAddNodeEvent(this, node !== null, node));
  }

  public expandToDepth(depth: number): void {
    this._eventSubject.next(new TreeModelExpandToEvent(this, depth));
  }

  public expandPath(path: ModelPath): void {
    this._root!.expand();

    const curPath: any[] = [];
    const p = path.slice(0);
    p.pop();

    p.forEach((k: ModelPathElement) => {
      curPath.push(k);
      const curNode = this.getNodeAtPath(curPath) as ContainerNode<any>;
      curNode.expand();
    });
  }

  public expandToNode(node: TreeNode<any>): void {
    this.expandPath(node.path());
  }

  public expandAll(): void {
    this._eventSubject.next(new TreeModelExpandAllEvent(this));
  }

  public collapseAll(): void {
    this._eventSubject.next(new TreeModelCollapseAllEvent(this));
  }

  public events(): Observable<TreeModelEvent> {
    return this._eventSubject.asObservable();
  }
}
