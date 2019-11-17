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

import React, {MouseEvent, ReactNode} from 'react';
import {NodeLabel} from "./NodeLabel";
import {Subscription} from "rxjs";
import classNames from "classnames";
import {SapphireEvent} from "../../../../SapphireEvent";
import {
  TreeNode,
  TreeNodeActiveSearchResultEvent,
  TreeNodeDataChangedEvent,
  TreeNodeSearchResultsEvent,
  TreeNodeSelectionEvent
} from "../../model/TreeNode";

export interface NodeRendererProps {
  editableLabel: boolean;
  labelPattern?: RegExp;
  label: string;
  node: TreeNode<any>;
}

export interface NodeRendererState {
  selected: boolean;
}

export abstract class NodeRenderer<P extends NodeRendererProps, S extends NodeRendererState> extends React.Component<P, S> {

  private _subscription: Subscription | null;

  protected constructor(props: P, context: any) {
    super(props, context);

    this._subscription = null;

    this.state = {
      selected: this.props.node.isSelected()
    } as S;

    this.select = this.select.bind(this);
  }

  public componentDidMount(): void {
    this._subscription = this.props.node.events().subscribe(e => this._processNodeEvents(e));
  }

  public componentWillUnmount(): void {
    if (this._subscription !== null) {
      this._subscription.unsubscribe();
    }
  }

  protected _processNodeEvents(e: SapphireEvent): void {
    if (e instanceof TreeNodeSelectionEvent) {
      const selected = this.props.node.isSelected();
      this.setState({selected} as S);
    } else if (e instanceof TreeNodeDataChangedEvent) {
      this.forceUpdate();
    } else if (e instanceof TreeNodeSearchResultsEvent) {
      this.forceUpdate();
    } else if (e instanceof TreeNodeActiveSearchResultEvent) {
      this.forceUpdate();
      if (e.active) {
        e.node.expandTo();
        e.node.select();
        this.focusActiveSearchResult();
      }
    }
  }

  private select(e: MouseEvent<HTMLDivElement>): boolean {
    this.props.node.tree().selectNode(this.props.node);
    e.stopPropagation();
    return false;
  }

  public render(): ReactNode {
    const classes = classNames(this._classNames());
    return (
      <div className={classes} onClick={this.select}>
        <NodeLabel label={this.props.label}
                   selected={this.state.selected}
                   labelPattern={this.props.labelPattern}
                   node={this.props.node}
                   editable={this.props.editableLabel}
        />
        {this._renderValue()}
      </div>
    );
  }

  protected abstract _renderValue(): ReactNode;

  protected _classNames(): { [key: string]: boolean } {
    return {
      "node": true
    };
  }

  protected focusActiveSearchResult(): void {
  }
}
