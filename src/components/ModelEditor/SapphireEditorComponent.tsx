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

import React, {ReactNode} from "react";
import {TreeModel} from "./components/tree-editor/model/TreeModel";
import {PathControlModel} from "./components/path/PathControlModel";
import {EditorMode, ViewType} from "./EditorMode";
import {SourceEditor} from "./components/source-editor/SourceEditor/";
import {TreeEditor} from "./components/tree-editor/TreeEditor";

export interface SapphireEditorComponentProps {
  treeModel: TreeModel;
  pathModel: PathControlModel;
  defaultMode: EditorMode;
  defaultView: ViewType;
}

export interface SapphireEditorComponentState {
  viewType: ViewType;
  editMode: EditorMode;
}

export class SapphireEditorComponent extends React.Component<SapphireEditorComponentProps, SapphireEditorComponentState> {

  constructor(props: SapphireEditorComponentProps, context: any) {
    super(props, context);
    this.state = {
      viewType: this.props.defaultView,
      editMode: this.props.defaultMode
    };

    this._onEditSource = this._onEditSource.bind(this);
    this._onEditTree = this._onEditTree.bind(this);
    this._onModeChanged = this._onModeChanged.bind(this);
  }

  private _onEditSource(): void {
    this.setState({viewType: "source"});
  }

  private _onEditTree(): void {
    this.setState({viewType: "tree"});
  }

  private _onModeChanged(mode: EditorMode): void {
    this.setState({editMode: mode});
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
                  editMode={this.state.editMode}
                  onEditSource={this._onEditSource}
                  onModeChanged={this._onModeChanged}
      />;

      return <div className="sapphire-editor">{editor}</div>
  }
}
