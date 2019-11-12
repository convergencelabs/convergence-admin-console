/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React, {ReactNode} from "react";
import styles from "./styles.module.css";
import {DomainStatus} from "../../../models/DomainStatus";
import {Icon} from "antd";

export interface DomainStatusIconProps {
  status: DomainStatus;
}

export class DomainStatusIcon extends React.Component<DomainStatusIconProps, {}> {

  public render(): ReactNode {
    const icon = this._iconType(this.props.status);
    const className = this._className(this.props.status);
    return (
      <Icon type={icon} className={className} spin={this.props.status === DomainStatus.INITIALIZING}/>
    );
  }

  private _iconType(status: DomainStatus): string {
    switch (status) {
      case DomainStatus.ONLINE:
        return "check-circle";
      case DomainStatus.OFFLINE:
        return "disconnect";
      case DomainStatus.MAINTENANCE:
        return "pause-circle";
      case DomainStatus.INITIALIZING:
        return "sync";
      case DomainStatus.DELETING:
        return "stop";
      case DomainStatus.ERROR:
        return "close-circle";
      default:
        throw new Error("Unknown domain status: " + status);
    }
  }

  private _className(status: DomainStatus): string {
    switch (status) {
      case DomainStatus.ONLINE:
        return styles.online;
      case DomainStatus.OFFLINE:
        return styles.offline;
      case DomainStatus.MAINTENANCE:
        return styles.maintenance;
      case DomainStatus.INITIALIZING:
        return styles.initializing;
      case DomainStatus.DELETING:
        return styles.deleting;
      case DomainStatus.ERROR:
        return styles.error;
      default:
        throw new Error("Unknown domain status: " + status);
    }
  }
}
