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
import {TreeModel} from "./model/TreeModel";
import {TreeView} from "./view/TreeView";
import {PathComponent} from "../path/PathComponent";
import {PathControlModel} from "../path/PathControlModel";
import {TreeEditorToolbar} from "./toolbar/TreeEditorToolbar";
import {EditorMode} from "../../EditorMode";

export interface TreeEditorProps {
  treeModel: TreeModel;
  pathModel: PathControlModel;
  defaultMode: EditorMode;
  onEditSource: () => void;
}

export interface TreeEditorState {
  editMode: EditorMode
}

export class TreeEditor extends React.Component<TreeEditorProps, TreeEditorState> {

  constructor(props: TreeEditorProps, context: any) {
    super(props, context);
    this.state = {
      editMode: this.props.defaultMode
    };
    this._onModeChanged = this._onModeChanged.bind(this);
  }

  private _onModeChanged(mode: EditorMode): void {
    this.props.treeModel.setEditable(mode === "edit");
    this.setState({editMode: mode});
  }

  public render(): ReactNode {
    return (
      <div className="tree-editor">
        <TreeEditorToolbar
          editMode={this.state.editMode}
          treeModel={this.props.treeModel}
          onModeChanged={this._onModeChanged}
          onEditSource={this.props.onEditSource}
        />
        <TreeView model={this.props.treeModel}/>
        <PathComponent model={this.props.pathModel}/>
      </div>
    );
  }
}
