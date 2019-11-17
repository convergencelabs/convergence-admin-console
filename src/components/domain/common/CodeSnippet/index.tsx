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
import Highlight from "react-highlight";
import styles from "./styles.module.css";
import CopyToClipboard from "react-copy-to-clipboard";
import {Button} from "antd";

export interface CodeSnippetProps {
  description: string | ReactNode;
  code: string;
}

export class CodeSnippet extends React.Component<CodeSnippetProps, {}> {
  public render(): ReactNode {
    return (
      <div className={styles.codeSnippet}>
        <div className={styles.description}>{this.props.description}</div>
        <div className={styles.code}>
          <span className={styles.copy}>
            <CopyToClipboard text={this.props.code}>
              <Button htmlType="button" icon="copy"/>
            </CopyToClipboard>
          </span>
          <Highlight className={"JavaScript"}>{this.props.code}</Highlight>
        </div>
      </div>
    )
  }
}
