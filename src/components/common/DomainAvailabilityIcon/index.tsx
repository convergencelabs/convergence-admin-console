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
import {DomainAvailability} from "../../../models/DomainAvailability";
import {CheckCircleOutlined, DisconnectOutlined, PauseCircleOutlined} from "@ant-design/icons";

export interface DomainAvailabilityIconProps {
  availability: DomainAvailability;
}

export class DomainAvailabilityIcon extends React.Component<DomainAvailabilityIconProps, {}> {

  public render(): ReactNode {
    switch (this.props.availability) {
      case DomainAvailability.ONLINE:
        return <CheckCircleOutlined className={styles.online}/>;
      case DomainAvailability.OFFLINE:
        return <DisconnectOutlined className={styles.offline}/>;
      case DomainAvailability.MAINTENANCE:
        return <PauseCircleOutlined className={styles.maintenance}/>;
      default:
        throw new Error("Unknown domain status: " + this.props.availability);
    }
  }
}
