/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React, {ReactNode} from "react";
import {Spin} from "antd";
import styles from "./styles.module.css";
import {MessagePage} from "../../../common/MessagePage";

export class DomainInitializing extends React.Component<{}, {}> {
  public render(): ReactNode {
    return (
      <MessagePage>
        <Spin size={"large"}/>
        <div className={styles.text}>This domain is initializing, please wait...</div>
      </MessagePage>
    );
  }
}