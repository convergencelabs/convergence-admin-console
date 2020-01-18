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
import {Icon} from "antd";
import styles from "./styles.module.css";
import {MessagePage} from "../MessagePage";

export interface PageNotFoundProps {
  text?: string;
}

export class PageNotFound extends React.Component<PageNotFoundProps, {}> {
  public render(): ReactNode {
    return (
      <MessagePage>
          <Icon type="frown" className={styles.icon}/>
          <div className={styles.title}>Page Not Found</div>
          <div className={styles.text}>{this.props.text || "Unfortunately, no page exists at this url."}</div>
      </MessagePage>
    );
  }
}