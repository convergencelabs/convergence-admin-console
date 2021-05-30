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
      case DomainStatus.READY:
        return "check-circle";
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
      case DomainStatus.READY:
        return styles.ready;
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
