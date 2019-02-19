import {SearchResult} from "./SearchResult";
import {BooleanNode} from "../BooleanNode";

export class BooleanSearchResult extends SearchResult {
  constructor(node: BooleanNode) {
    super(node);
  }
}
