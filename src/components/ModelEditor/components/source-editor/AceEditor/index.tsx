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
import ace from 'brace';
import 'brace/mode/json';
import 'brace/theme/xcode';

import styles from "./styles.module.css";

export interface CursorPosition {
  row: number;
  col: number;
}

export interface AceEditorProps {
  initialSource: string;
  editable: boolean;
  onCursorChanged: (cursor: CursorPosition) => void;
  onValueChange: (value: string) => void;
}

export class AceEditor extends React.Component<AceEditorProps, {}> {

  private _container: HTMLDivElement | null = null;
  private _editor: ace.Editor | null = null;

  componentDidMount() {
    this.initEditor();
  }

  initEditor() {
    this._editor = ace.edit(this._container!);
    this._editor.setTheme("ace/theme/xcode");
    this._editor.setReadOnly(!this.props.editable);
    this._editor.$blockScrolling = Infinity;

    const session = this._editor.getSession();
    session.setMode("ace/mode/json");
    session.setValue(this.props.initialSource);
    session.setTabSize(2);
    session.setUseSoftTabs(true);

    session.on("change", (event) => {
      const value = this._editor!.getSession().getDocument().getValue();
      this.props.onValueChange(value);
    });

    session.getSelection().on("changeCursor", () => {
      const position = session.getSelection().getCursor();
      this.props.onCursorChanged({row: position.row, col: position.column});
    });

    this._editor.focus();
  }

  public render(): ReactNode {
    return <div className={styles.aceEditor} ref={div => {
      this._container = div;
    }}/>
  }
}
