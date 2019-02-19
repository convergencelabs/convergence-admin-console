import React, {ReactNode} from "react";
import {Subscription} from "rxjs";
import {TreeModel} from "../model/TreeModel";

export interface SearchControlProps {
  treeModel: TreeModel;
}

export interface SearchControlState {
  resultCount: number;
  currentResult: number;
  searchTerm: string;
}

export class SearchControl extends React.Component<SearchControlProps, SearchControlState> {

  private _searchField: HTMLInputElement | null;
  private _subscription: Subscription | null;

  constructor(props: SearchControlProps, context: any) {
    super(props, context);

    this._searchField = null;
    this._subscription = null;

    this.state = {
      resultCount: 0,
      currentResult: 0,
      searchTerm: ""
    };
  }

  public componentWillMount(): void {
    this._subscription = this.props.treeModel.getSearchManager()
      .events()
      .subscribe(() => {
        this._updateState();
      });
  }

  public componentWillUnmount(): void {
    if (this._subscription !== null) {
      this._subscription.unsubscribe();
    }
  }

  onKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      this.onNext();
    } else if (event.key === 'Escape') {
      this.onClear();
    }
  };

  onInput = (event: any) => {
    this.setState({searchTerm: event.target.value} as SearchControlState);
    this.onSearch();
  };

  onSearch = () => {
    const searchManager = this.props.treeModel.getSearchManager();
    searchManager.search(this._searchField!.value);
    this._updateState();
  };

  onNext = () => {
    const searchManager = this.props.treeModel.getSearchManager();
    if (searchManager.resultCount() > 0) {
      searchManager.nextResult();
      this._updateState();
    }
  };

  onPrev = () => {
    const searchManager = this.props.treeModel.getSearchManager();
    if (searchManager.resultCount() > 0) {
      searchManager.prevResult();
      this._updateState();
    }
  };

  onClear = () => {
    const searchManager = this.props.treeModel.getSearchManager();
    searchManager.clearAll();
    this.setState({searchTerm: ""} as SearchControlState);
  };

  private _updateState(): void {
    const searchManager = this.props.treeModel.getSearchManager();
    this.setState({
      resultCount: searchManager.resultCount(),
      currentResult: searchManager.currentResultIndex()
    } as SearchControlState);
  }

  public render(): ReactNode {
    let resultIndicator = null;
    if (this.state.searchTerm && this.state.searchTerm.length > 0) {
      resultIndicator = (
        <span className="search-meta">{this.state.currentResult + 1} of {this.state.resultCount}</span>);
    } else {
      resultIndicator = (<span className="search-meta">&nbsp;</span>);
    }
    return (
      <div className="search-control">
        <input type="text"
               id="searchField"
               placeholder={"Search"}
               value={this.state.searchTerm}
               ref={e => {this._searchField = e;}}
               onChange={() => {}}
               onKeyDown={this.onKeyDown}
               onInput={this.onInput}/>{resultIndicator}
        <i className="fa fa-chevron-up" onClick={this.onPrev}/>
        <i className="fa fa-chevron-down" onClick={this.onNext}/>
        <i className="fa fa-times" onClick={this.onClear}/>
      </div>
    );
  }
}
