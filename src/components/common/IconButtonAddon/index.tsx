/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React, {ReactNode} from "react";
import styles from "./styles.module.css";
import {Button} from "antd";

export interface IconButtonAddonProps {
  icon: string;
  onClick?: (e: any) => void
}

export class IconButtonAddon extends React.Component<IconButtonAddonProps, {}> {
  public render(): ReactNode {
    return (
      <Button onClick={this.props.onClick}
              className={styles.iconButton}
              icon={this.props.icon}
              htmlType="button"
      />
    );
  }
}
