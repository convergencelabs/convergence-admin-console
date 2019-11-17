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
import {ToolbarButton} from "../../common/ToolbarButton/";
import styles from "./styles.module.css";
import {faSave, faWindowClose} from "@fortawesome/free-regular-svg-icons";

export interface SourceEditorToolbarProps {
  onSaveSource: (data: {[key: string]: any}) => void;
  onCancelSource: () => void;
  canSaveSource: boolean;
  editable: boolean;
}

export class SourceEditorToolbar extends React.Component<SourceEditorToolbarProps, {}> {

  public render(): ReactNode {
    let save = null;
    if (this.props.editable) {
      save = <ToolbarButton icon={faSave} enabled={this.props.canSaveSource} onClick={this.onSaveSource} />;
    }

    return <div className={styles.toolbar}>
      {save}
      <span style={{flex: 1}} />
      <ToolbarButton icon={faWindowClose} enabled onClick={this.onCancelSource} />
    </div>;
  }

  private onSaveSource = () => {
    this.props.onSaveSource({});
  };

  private onCancelSource = () => {
    this.props.onCancelSource();
  };
}
