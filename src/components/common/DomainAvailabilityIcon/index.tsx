/*
 * Copyright (c) 2021 - Convergence Labs, Inc.
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
import {Icon} from "antd";
import {DomainAvailability} from "../../../models/DomainAvailability";

export interface DomainAvailabilityIconProps {
  availability: DomainAvailability;
}

export class DomainAvailabilityIcon extends React.Component<DomainAvailabilityIconProps, {}> {

  public render(): ReactNode {
    const icon = this._iconType(this.props.availability);
    const className = this._className(this.props.availability);
    return (
      <Icon type={icon} className={className}/>
    );
  }

  private _iconType(status: DomainAvailability): string {
    switch (status) {
      case DomainAvailability.ONLINE:
        return "check-circle";
      case DomainAvailability.OFFLINE:
        return "disconnect";
      case DomainAvailability.MAINTENANCE:
        return "pause-circle";
      default:
        throw new Error("Unknown domain status: " + status);
    }
  }

  private _className(status: DomainAvailability): string {
    switch (status) {
      case DomainAvailability.ONLINE:
        return styles.online;
      case DomainAvailability.OFFLINE:
        return styles.offline;
      case DomainAvailability.MAINTENANCE:
        return styles.maintenance;
      default:
        throw new Error("Unknown domain status: " + status);
    }
  }
}
