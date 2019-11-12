/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
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
          <div className={styles.text}>{this.props.text || "Unfortunately no page exists at this url."}</div>
      </MessagePage>
    );
  }
}