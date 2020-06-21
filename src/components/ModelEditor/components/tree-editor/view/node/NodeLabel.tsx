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

import React, {ReactNode} from 'react';
import classNames from "classnames";
import {Subscription} from "rxjs";
import {PropertyEditor} from "../editors/PropertyEditor";
import {KeySearchResult} from "../../model/search/KeySearchResult";
import {Highlighter, HighlightRange} from "../highlighter/Highlighter";
import {SearchResult} from "../../model/search/SearchResult";
import {PropertyValidation, PropertyValidator} from "../../validator/PropertyValidator";
import {TreeNode, TreeNodeActiveSearchResultEvent, TreeNodeSearchResultsEvent} from "../../model/TreeNode";
import {ArrayNode} from "../../model/ArrayNode";
import {ObjectNode} from "../../model/ObjectNode";

export interface NodeLabelProps {
  selected: boolean;
  label?: string;
  labelPattern?: RegExp;
  node: TreeNode<any>;
  editable: boolean;
}

export interface NodeLabelState {
  editing: boolean;
}

export class NodeLabel extends React.Component<NodeLabelProps, NodeLabelState> {

  private _subscription: Subscription | null = null;
  private _labelSpan: HTMLSpanElement | null = null;
  private _textNode: Text | null = null;

  constructor(props: NodeLabelProps) {
    super(props);
    this._onDoubleClick = this._onDoubleClick.bind(this);
    this.onEditComplete = this.onEditComplete.bind(this);
    this.onEditCanceled = this.onEditCanceled.bind(this);
    this.validateProperty = this.validateProperty.bind(this);

    this.state = {
      editing: false
    };

    this._setSpan = this._setSpan.bind(this);
  }

  public componentDidMount(): void {
    this._subscription = this.props.node.events().subscribe(e => {
      if (e instanceof TreeNodeActiveSearchResultEvent) {
        if (this._labelSpan) {
          this._labelSpan.scrollIntoView();
        }
      } else if (e instanceof TreeNodeSearchResultsEvent) {
        this.forceUpdate();
      }
    });
  }

  public componentWillUnmount(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }

  private _setSpan(span: HTMLSpanElement) {
    this._labelSpan = span;
    if (this._labelSpan) {
      this._textNode = this._labelSpan.firstChild as Text;
    } else {
      this._textNode = null;
    }
  }

  private _getLabel(): string {
    let label;
    if (typeof this.props.label === "string") {
      label = this.props.label;
    } else {
      label = this.props.node.element().relativePathFromParent();
    }

    return label;
  }

  private _onDoubleClick(): void {
    if (this.props.editable &&
      this.props.node.tree().isEditable() &&
      !this.props.node.tree().isAddingNode()
    ) {
      this.setState({editing: true} as NodeLabelState);
    }
  }

  private onEditComplete(value: string): void {
    const parent = this.props.node.parent();
    if (parent instanceof ArrayNode) {
      let toIndex;
      if (value.length === 0) {
        toIndex = 0
      } else {
        toIndex = Math.min(Number(value), parent.size() - 1);
      }

      const fromIndex = this.props.node.element().relativePathFromParent();
      if (toIndex !== fromIndex) {
        parent.element().reorder(fromIndex, toIndex);
      }
    } else if (parent instanceof ObjectNode) {
      const newKey = value;
      const oldKey = this.props.node.element().relativePathFromParent();
      if (newKey !== oldKey) {
        parent.element().rename(oldKey, newKey);
      }
    }
    this.setState({editing: false} as NodeLabelState);
  }

  private onEditCanceled(): void {
    this.setState({editing: false} as NodeLabelState);
  }

  private validateProperty(value: string): PropertyValidation {
    return PropertyValidator.validate(this.props.node.parent()!, value);
  }

  public render(): ReactNode {
    const classes = classNames({
      "property": true,
      "selected": this.props.selected,
      "root": this.props.node.depth() === 0
    });

    let label: any = this._getLabel();
    if (!label) {
      label = " ";
    }

    let component = null;
    if (this.state.editing) {
      component = (
        <PropertyEditor minWidth={20}
                        pattern={this.props.labelPattern}
                        value={this._getLabel()}
                        autoFocus={true}
                        onValidate={this.validateProperty}
                        onComplete={this.onEditComplete}
                        onCancel={this.onEditCanceled}
                        completeOnBlur
        />
      );
    } else {
      const ranges = this._getSearchRanges();
      component = (
        <div className={classes}>
          <span className="propertyLabel" onDoubleClick={this._onDoubleClick} ref={this._setSpan}>{label}</span>
          <Highlighter ranges={ranges}/>
        </div>
      );
    }

    return (
      <div className="label-wrapper">
        {component}
        <span className="colon">:</span>
      </div>
    );
  }

  private _getSearchRanges(): HighlightRange[] {
    const results: SearchResult[] = this.props.node.searchResults();
    const ranges: HighlightRange[] = [];
    if (this._textNode && results.length > 0) {
      const results: SearchResult[] = this.props.node.searchResults();
      let keyResults: KeySearchResult[] = [];
      results.forEach(sr => {
        if (sr instanceof KeySearchResult) {
          keyResults.push(sr);
        }
      });

      const active = this.props.node.getActiveSearchResult();
      keyResults.forEach(result => {
        if (result instanceof KeySearchResult) {
          const range: Range = document.createRange();
          range.setStart(this._textNode!, result.start());
          range.setEnd(this._textNode!, result.end());
          ranges.push({
            range: range,
            active: result === active
          });
        }
      });
    }
    return ranges;
  }
}
