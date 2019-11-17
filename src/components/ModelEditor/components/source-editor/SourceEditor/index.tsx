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

import {TreeModel} from "../../tree-editor/model/TreeModel";
import React, {ReactNode} from "react";
import {AceEditor, CursorPosition} from "../AceEditor/";
import {SOURCE_STATUS_ERROR, SourceEditorStatusBar, SourceStatus} from "../SourceEditorStatusBar/";
import {SourceEditorToolbar} from "../SourceEditorToolbar/";
import styles from "./styles.module.css";

export interface SourceEditorProps {
  treeModel: TreeModel;
  editable: boolean;
  onClose: () => void;
}

export interface SourceEditorState {
  originalSource: string;
  source: string;
  status: SourceStatus | null;
  statusMessage: string;
  cursor: {row: number, col: number};
}

export class SourceEditor extends React.Component<SourceEditorProps, SourceEditorState> {

  constructor(props: SourceEditorProps) {
    super(props);

    const source = JSON.stringify(this.props.treeModel.root()!.element().toJSON(), null, '  ');
    this.state = {
      source: source,
      originalSource: source,
      status: null,
      statusMessage: '',
      cursor: {row: 0, col: 0}
    };

    this._onValueChange = this._onValueChange.bind(this);
    this._onCursorChange = this._onCursorChange.bind(this);
    this._onSaveSource = this._onSaveSource.bind(this);
    this._onCancelSource = this._onCancelSource.bind(this);
  }

  private _onValueChange(source: string): void {
    let statusMessage = "";
    let status = null;

    try {
      JSON.parse(source);
    } catch (e) {
      statusMessage = "Invalid JSON!";
      status = SOURCE_STATUS_ERROR;
    }

    this.setState({
      source,
      statusMessage,
      status
    } as SourceEditorState);
  }

  private _onCursorChange(cursor: CursorPosition): void {
    this.setState({cursor} as SourceEditorState)
  }

  private _onSaveSource(): void {
    if (this.state.originalSource !== this.state.source) {
      const source = this.state.source;
      const data = JSON.parse(source);
      this.props.treeModel.root()!.element().value(data);
    }

    this.props.onClose();
  }

  private _onCancelSource(): void {
    this.props.onClose();
  }

  public render(): ReactNode {

    return (
      <div className={styles.sourceEditor}>
        <SourceEditorToolbar onSaveSource={this._onSaveSource}
               onCancelSource={this._onCancelSource}
               canSaveSource={this.state.status === null}
               editable={this.props.editable}/>
        <AceEditor initialSource={this.state.originalSource}
                   editable={this.props.editable}
                   onCursorChanged={this._onCursorChange}
                   onValueChange={this._onValueChange}
        />
        <SourceEditorStatusBar cursor={this.state.cursor}
                               status={this.state.status}
                               statusMessage={this.state.statusMessage}/>
      </div>
    );
  }
}
