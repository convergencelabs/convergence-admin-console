import {ModelElementTypes} from "../../../../model/ModelElementTypes";

export interface SearchManagerOptions {
  caseSensitive: boolean;
}

export class SearchResultsUpdated implements SapphireEvent {
  public static readonly NAME: string = "search_results";
  public name: string = SearchResultsUpdated.NAME;

  constructor() {
    Object.freeze(this);
  }
}

export class SearchManager {

  private _subject: Subject<SapphireEvent>;
  private _currentResults: SearchResult[];
  private _currentResultIndex: number;
  private _activeResult: SearchResult | null;
  private _treeModel: TreeModel;
  private _terms: string | null;

  private _options: SearchManagerOptions;

  constructor(treeModel: TreeModel, options: SearchManagerOptions) {
    this._currentResults = [];
    this._currentResultIndex = -1;
    this._activeResult = null;
    this._treeModel = treeModel;
    this._terms = null;
    this._subject = new Subject<SapphireEvent>();

    this._options = options || <SearchManagerOptions>{};

    if (this._options.caseSensitive === undefined) {
      this._options.caseSensitive = false;
    }
  }

  public search(terms: string): void {
    if (typeof terms === "string" && terms.trim().length > 0) {
      if (!this._options.caseSensitive) {
        this._terms = terms.toLowerCase();
      } else {
        this._terms = terms;
      }

      this._search();
    } else {
      this._terms = null;
      this._currentResults = [];
      this._clearAll(this._treeModel.root()!);
      this._subject.next(new SearchResultsUpdated());
    }
  }

  public update(): void {
    if (typeof this._terms === "string") {
      this._search();
    }
  }

  private _search(): void {
    this._currentResults = this.processNode(this._terms!, this._treeModel.root()!);
    this._currentResults.sort((r1, r2) => {
      return PathUtils.comparePaths(r1.getNode().path(), r2.getNode().path());
    });
    if (this._currentResults.length > 0) {
      this._currentResultIndex = 0;
    } else {
      this._currentResultIndex = -1;
    }

    this._setActiveResult();
    this._subject.next(new SearchResultsUpdated());
  }

  public terms(): string | null {
    return this._terms;
  }

  public hasResults(): boolean {
    return this._currentResults.length > 0;
  }

  public results(): SearchResult[] {
    return this._currentResults.slice(0);
  }

  public resultCount(): number {
    return this._currentResults.length;
  }

  public currentResult(): SearchResult | null {
    if (this._currentResultIndex >= 0) {
      return this._currentResults[this._currentResultIndex];
    } else {
      return null;
    }
  }

  public currentResultIndex(): number {
    return this._currentResultIndex;
  }

  public nextResult(): SearchResult {
    if (this._currentResultIndex === this._currentResults.length - 1) {
      this._currentResultIndex = 0;
    } else {
      this._currentResultIndex++;
    }

    this._setActiveResult();

    return this._currentResults[this._currentResultIndex];
  }

  public prevResult(): SearchResult {
    if (this._currentResultIndex === 0) {
      this._currentResultIndex = this._currentResults.length - 1;
    } else {
      this._currentResultIndex--;
    }

    this._setActiveResult();

    return this._currentResults[this._currentResultIndex];
  }

  public clearAll(): void {
    this._activeResult = null;
    this._currentResults = [];
    this._currentResultIndex = -1;
    this._clearAll(this._treeModel.root()!);
    this._terms = null;
  }

  public events(): Observable<SapphireEvent> {
    return this._subject.asObservable();
  }

  private _setActiveResult(): void {
    if (this._activeResult !== null) {
      this._activeResult.deactivate();
    }

    if (this._currentResultIndex >= 0) {
      this._activeResult = this._currentResults[this._currentResultIndex];
      this._activeResult.activate();
    }
  }

  private processNode(terms: string, node: TreeNode<any>): SearchResult[] {
    const type: string = node.type();

    let keyResults: SearchResult[] = [];

    const parent = node.parent();
    if (parent !== null && parent.type() === ModelElementTypes.OBJECT) {
      let key: string = node.relativePathFromParent() as string;
      if (!this._options.caseSensitive) {
        key = key.toLowerCase();
      } else {
        // FIXME this is not needed?
        key = key;
      }

      let pos: number = key.indexOf(terms);
      while (pos !== -1) {
        keyResults.push(new KeySearchResult(node, pos, pos + terms.length));
        pos = key.indexOf(terms, pos + 1);
      }
    }

    let results: SearchResult[] = [];

    if (node.type() === ModelElementTypes.OBJECT) {
      results = keyResults.concat(this.processObjectNode(terms, node as ObjectNode));
      node.setSearchResults(keyResults);
    } else if (node.type() === ModelElementTypes.ARRAY) {
      results = keyResults.concat(this.processArrayNode(terms, node as ArrayNode));
      node.setSearchResults(keyResults);
    } else if (node instanceof StringNode) {
      results = keyResults.concat(this.processStringNode(terms, node));
      node.setSearchResults(results);
    } else if (node instanceof NumberNode) {
      results = keyResults.concat(this.processNumberNode(terms, node));
      node.setSearchResults(results);
    } else if (node instanceof BooleanNode) {
      results = keyResults.concat(this.processBooleanNode(terms, node));
      node.setSearchResults(results);
    } else if (node instanceof NullNode) {
      results = keyResults.concat(this.processNullNode(terms, node));
      node.setSearchResults(results);
    } else if (node instanceof DateNode) {
      results = keyResults.concat(this.processDateNode(terms, node));
      node.setSearchResults(results);
    } else {
      throw new Error("Unknown node type: " + type);
    }

    return results;
  }

  private processObjectNode(terms: string, node: ObjectNode): SearchResult[] {
    let results: SearchResult[] = [];

    node.forEach((key, child) => {
      const childResults: SearchResult[] = this.processNode(terms, child);
      results = results.concat(childResults);
    });

    return results;
  }

  private processArrayNode(terms: string, node: ArrayNode): SearchResult[] {
    let results: SearchResult[] = [];

    node.forEach((index, child) => {
      const childResults: SearchResult[] = this.processNode(terms, child);
      results = results.concat(childResults);
    });

    return results;
  }

  private processStringNode(terms: string, node: StringNode): SearchResult[] {

    const results: SearchResult[] = [];

    if (terms.length > 0) {
      let value: string = node.element().value();

      if (!this._options.caseSensitive) {
        value = value.toLowerCase();
      }

      const matches: any[] = [];

      let pos: number = value.indexOf(terms);
      while (pos !== -1) {
        results.push(new StringSearchResult(node, pos, pos + terms.length));
        pos = value.indexOf(terms, pos + 1);
      }
    }

    return results;
  }

  private processNumberNode(terms: string, node: NumberNode): SearchResult[] {
    const results: SearchResult[] = [];
    const num = Number(terms);
    if (!isNaN(num) && num === node.element().value()) {
      results.push(new NumberSearchResult(node));
    }
    return results;
  }

  private processNullNode(terms: string, node: NullNode): SearchResult[] {
    const results: SearchResult[] = [];
    if (terms === "null") {
      results.push(new NullSearchResult(node));
    }
    return results;
  }

  private processBooleanNode(terms: string, node: BooleanNode): SearchResult[] {
    const results: SearchResult[] = [];
    const value = node.element().value();
    if (terms === "false" && !value || terms === "true" && value) {
      results.push(new BooleanSearchResult(node));
    }
    return results;
  }

  private processDateNode(terms: string, node: DateNode): SearchResult[] {
    const results: SearchResult[] = [];
    const value = DateUtils.formatDate(node.element().value());
    if (value.indexOf(terms) >= 0) {
      results.push(new DateSearchResult(node));
    }
    return results;
  }

  private _clearAll(node: TreeNode<any>): void {
    node.setSearchResults([]);
    node.setActiveResult(null);

    if (node.type() === ModelElementTypes.OBJECT) {
      (node as ObjectNode).forEach((k, v) => this._clearAll(v));
    } else if (node.type() === ModelElementTypes.ARRAY) {
      (node as ArrayNode).forEach((i, v) => this._clearAll(v));
    }
  }
}

import {SearchResult} from "./SearchResult";
import {KeySearchResult} from "./KeySearchResult";
import {StringSearchResult} from "./StringSearchResult";
import {ObjectNode} from "../ObjectNode";
import {TreeNode} from "../TreeNode";
import {ArrayNode} from "../ArrayNode";
import {NullSearchResult} from "./NullSearchResult";
import {NullNode} from "../NullNode";
import {StringNode} from "../StringNode";
import {NumberNode} from "../NumberNode";
import {BooleanNode} from "../BooleanNode";
import {DateNode} from "../DateNode";
import {TreeModel} from "../TreeModel";
import {PathUtils} from "../../../../utils/PathUtils";
import {DateUtils} from "../../../../utils/DateUtils";
import {BooleanSearchResult} from "./BooleanSearchResult";
import {NumberSearchResult} from "./NumberSearchResult";
import {DateSearchResult} from "./DateSearchResult";
import {Subject, Observable} from "rxjs";
import {SapphireEvent} from "../../../../SapphireEvent";
