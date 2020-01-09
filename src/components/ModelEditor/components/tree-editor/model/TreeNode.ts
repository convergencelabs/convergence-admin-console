/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is part of the Convergence Server, which is released under
 * the terms of the GNU General Public License version 3 (GPLv3). A copy
 * of the GPLv3 should have been provided along with this file, typically
 * located in the "LICENSE" file, which is part of this source code package.
 * Alternatively, see <https://www.gnu.org/licenses/gpl-3.0.html> for the
 * full text of the GPLv3 license, if it was not provided.
 */

import {ModelElement, ModelElementEvent} from "../../../model/ModelElement";
import {TreeModel} from "./TreeModel";
import {Observable, Subject, Subscription} from "rxjs";
import {SapphireEvent} from "../../../SapphireEvent";
import {ModelPath, ModelPathElement} from "../../../model/ModelPath";
import {ContainerNode} from "./ContainerNode";
import {SearchResult} from "./search/SearchResult";
import {ModelSubtreeChangedEvent} from "../../../model/ContainterElement";

export interface TreeNodeEvents {
  readonly SELECTION_CHANGED: string;
}

export class TreeNodeSelectionEvent implements SapphireEvent {
  public static NAME: string = "selection_changed";
  public name: string = TreeNodeSelectionEvent.NAME;

  constructor(public readonly node: TreeNode<any>) {
    Object.freeze(this);
  }
}

export class TreeNodeDataChangedEvent implements SapphireEvent {
  public static NAME: string = "data_changed";
  public name: string = TreeNodeDataChangedEvent.NAME;

  constructor(public readonly node: TreeNode<any>,
              public readonly remote: boolean = false) {
    Object.freeze(this);
  }
}

export class TreeNodeSearchResultsEvent implements SapphireEvent {
  public static NAME: string = "search_match";
  public name: string = TreeNodeSearchResultsEvent.NAME;

  constructor(public readonly node: TreeNode<any>,
              public readonly searchResults: SearchResult[]) {
    Object.freeze(this);
  }
}

export class TreeNodeActiveSearchResultEvent implements SapphireEvent {
  public static NAME: string = "search_active";
  public name: string = TreeNodeActiveSearchResultEvent.NAME;

  constructor(public readonly node: TreeNode<any>,
              public readonly active: boolean,
              public readonly result: SearchResult) {
    Object.freeze(this);
  }
}

export class SubtreeChangedEvent implements SapphireEvent {
  public static NAME: string = "subtree";
  public name: string = SubtreeChangedEvent.NAME;

  constructor(public readonly node: TreeNode<any>,
              public readonly remote: boolean) {
    Object.freeze(this);
  }
}

export abstract class TreeNode<T extends ModelElement<any>> {

  public static readonly Events: TreeNodeEvents = {
    SELECTION_CHANGED: TreeNodeSelectionEvent.NAME
  };

  private readonly _tree: TreeModel;
  private readonly _parent: ContainerNode<any> | null;
  private readonly _element: T;
  private _selected: boolean;
  private _eventSubject: Subject<SapphireEvent>;
  private _elementSubscription: Subscription;
  private _searchResults: SearchResult[];
  private _activeSearchResult: SearchResult | null;

  constructor(tree: TreeModel,
              parent: ContainerNode<any> | null,
              element: T, selected: boolean) {
    this._tree = tree;
    this._parent = parent;
    this._element = element;
    this._selected = selected;
    this._eventSubject = new Subject();
    this._elementSubscription = element.events().subscribe(e => {
      if (e instanceof ModelSubtreeChangedEvent) {
        this._emit(new SubtreeChangedEvent(this, e.remote));
      }
      this._handleElementEvent(e);
    });
    this._searchResults = [];
    this._activeSearchResult = null;
  }

  public setSearchResults(results: SearchResult[]): void {
    if (this._searchResults.length === 0 && results.length === 0) {
      return;
    }

    this._searchResults = results;
    this.setActiveResult(null);
    this._emit(new TreeNodeSearchResultsEvent(this, results));
  }

  public searchResults(): SearchResult[] {
    return this._searchResults;
  }

  public setActiveResult(result: SearchResult | null): void {
    if (this._activeSearchResult === null && result === null) {
      return;
    }

    this._activeSearchResult = result;
    const active = result !== null;

    if (result !== null) {
      this._emit(new TreeNodeActiveSearchResultEvent(this, active, result));
    }
  }

  public getActiveSearchResult(): SearchResult | null {
    return this._activeSearchResult;
  }

  public hasActiveResult(): boolean {
    return this._activeSearchResult !== null;
  }

  public select(): void {
    this._tree.selectNode(this);
  }

  public expandTo(): void {
    this._tree.expandToNode(this);
  }

  public tree(): TreeModel {
    return this._tree;
  }

  public id(): string {
    return this._element.id();
  }

  public type(): string {
    return this._element.type();
  }

  public path(): ModelPath {
    return this._element.path();
  }

  public depth(): number {
    return this._element.depth();
  }

  public parent(): ContainerNode<any> | null {
    return this._parent;
  }

  public relativePathFromParent(): ModelPathElement | null {
    return this.element().relativePathFromParent();
  }

  public get(key: ModelPathElement): TreeNode<any> | null {
    const path = this.path().slice(0);
    path.push(key);
    return this._tree.getNodeAtPath(path);
  }

  public element(): T {
    return this._element;
  }

  public isSelected(): boolean {
    return this._selected;
  }

  public _setSelected(selected: boolean): void {
    if (this._selected !== selected) {
      this._selected = selected;
      this._emit(new TreeNodeSelectionEvent(this));
    }
  }

  public removeFromParent(): void {
    this.tree().deleteNode(this);
  }

  public events(): Observable<SapphireEvent> {
    return this._eventSubject.asObservable();
  }

  protected _emit(event: SapphireEvent): void {
    this._eventSubject.next(event);
  }

  protected _emitChanged(remote: boolean = false): void {
    this.setSearchResults([]);
    this._emit(new TreeNodeDataChangedEvent(this, remote));
  }

  public dispose(): void {
    this._elementSubscription.unsubscribe();
  }

  public getNodeAtPath(path: ModelPath): TreeNode<any> | null {
    if (path.length === 0) {
      return this;
    } else {
      return null;
    }
  }

  protected abstract _handleElementEvent(e: ModelElementEvent): void;
}
