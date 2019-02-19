import {SearchResult} from "./SearchResult";
import {DateNode} from "../DateNode";

export class DateSearchResult extends SearchResult {
  constructor(node: DateNode) {
    super(node);
  }
}
