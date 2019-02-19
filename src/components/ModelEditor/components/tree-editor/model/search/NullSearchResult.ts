import {SearchResult} from "./SearchResult";
import {NullNode} from "../NullNode";

export class NullSearchResult extends SearchResult {
  constructor(node: NullNode) {
    super(node);
  }
}
