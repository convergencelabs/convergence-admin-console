/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import {ReactNode} from "react";
import {NodeRenderer, NodeRendererProps, NodeRendererState} from "./NodeRenderer";
import {SapphireEvent} from "../../../../SapphireEvent";
import {TreeNodeDataChangedEvent} from "../../model/TreeNode";

export interface EditableNodeRendererProps extends NodeRendererProps {
}

export interface EditableNodeRendererState extends NodeRendererState {
  editing: boolean;
  remoteChange?: boolean;
}

export abstract class EditableNodeRenderer<P extends EditableNodeRendererProps, S extends EditableNodeRendererState>
  extends NodeRenderer<P, S> {

  private _remoteChangeTimeout: number | null;

  protected constructor(props: P, context: any) {
    super(props, context);

    this.state = {
      editing: false,
      selected: this.props.node.isSelected()
    } as S;

    this.startEdit = this.startEdit.bind(this);
    this.stopEdit = this.stopEdit.bind(this);
    this.render = super.render;

    this._remoteChangeTimeout = null;
  }

  protected startEdit(): void {
    if (this.props.node.tree().isEditable() && !this.props.node.tree().isAddingNode()) {
      this.setState({editing: true} as S);
    }
  }

  protected stopEdit(): void {
    this.setState({editing: false} as S);
  }

  protected _renderValue(): ReactNode {
    return this.state.editing ? this._getEditComponent() : this._getRenderComponent()
  }

  protected _processNodeEvents(e: SapphireEvent): void {
    super._processNodeEvents(e);

    if (e instanceof TreeNodeDataChangedEvent) {
      if (e.remote) {
        if (this._remoteChangeTimeout !== null) {
          window.clearTimeout(this._remoteChangeTimeout);
          this._remoteChangeTimeout = null;
        }

        if (this.state.remoteChange) {
          this.setState({remoteChange: false} as S);
        }

        window.setTimeout(() => {
          this.setState({remoteChange: true} as S);
        }, 10);

        this._remoteChangeTimeout = window.setTimeout(() => {
          this.setState({remoteChange: false} as S);
          this._remoteChangeTimeout = null;
        }, 500);
      }
    }
  }

  protected _classNames(): {[key: string]: boolean} {
      return Object.assign({
        "value-node": true,
        "remote-change": this.state.remoteChange
      }, super._classNames());
  }

  protected abstract _getEditComponent(): ReactNode;
  protected abstract _getRenderComponent(): ReactNode;
}
