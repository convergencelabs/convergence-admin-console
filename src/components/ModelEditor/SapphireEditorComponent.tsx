/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React, {ReactNode} from "react";
import {TreeModel} from "./components/tree-editor/model/TreeModel";
import {PathControlModel} from "./components/path/PathControlModel";
import {EditorMode, ViewType} from "./EditorMode";
import {SourceEditor} from "./components/source-editor/SourceEditor/index";
import {TreeEditor} from "./components/tree-editor/TreeEditor";

export interface SapphireEditorComponentProps {
  treeModel: TreeModel;
  pathModel: PathControlModel;
  defaultMode: EditorMode;
  defaultView: ViewType;
}

export interface SapphireEditorComponentState {
  viewType: ViewType;
}

export class SapphireEditorComponent extends React.Component<SapphireEditorComponentProps, SapphireEditorComponentState> {

  constructor(props: SapphireEditorComponentProps, context: any) {
    super(props, context);
    this.state = {
      viewType: this.props.defaultView
    };

    this._onEditSource = this._onEditSource.bind(this);
    this._onEditTree = this._onEditTree.bind(this);
  }

  private _onEditSource(): void {
    this.setState({
      viewType: "source"
    } as SapphireEditorComponentState);
  }

  private _onEditTree(): void {
    this.setState({
      viewType: "tree"
    } as SapphireEditorComponentState);
  }

  public render(): ReactNode {
    const editor = this.state.viewType === "source" ?
      <SourceEditor
        treeModel={this.props.treeModel}
        editable={this.props.treeModel.isEditable()}
        onClose={this._onEditTree}
      />
      :
      <TreeEditor treeModel={this.props.treeModel}
                  pathModel={this.props.pathModel}
                  defaultMode={this.props.defaultMode}
                  onEditSource={this._onEditSource}
      />;

      return <div className="sapphire-editor">{editor}</div>
  }
}
