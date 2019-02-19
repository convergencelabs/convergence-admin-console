import {SearchResult} from "./SearchResult";
import {NumberNode} from "../NumberNode";

export class NumberSearchResult extends SearchResult {
  constructor(node: NumberNode) {
    super(node);
  }
}
