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
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DatabaseFilled,
  DeleteOutlined,
  SyncOutlined
} from "@ant-design/icons";

export interface DomainStatusIconProps {
  status: DomainStatus;
}

export class DomainStatusIcon extends React.Component<DomainStatusIconProps, {}> {

  public render(): ReactNode {
    switch (this.props.status) {
      case DomainStatus.READY:
        return <CheckCircleOutlined className={styles.ready} />;
      case DomainStatus.INITIALIZING:
        return <SyncOutlined className={styles.initializing} />;
      case DomainStatus.DELETING:
        return <DeleteOutlined className={styles.deleting} />;
      case DomainStatus.ERROR:
        return <CloseCircleOutlined className={styles.error} />;
      case DomainStatus.SCHEMA_UPGRADE_REQUIRED:
        return <DatabaseFilled className={styles.upgradeRequired} />;
      case DomainStatus.SCHEMA_UPGRADING:
        return <SyncOutlined className={styles.upgrading} />;
      default:
        throw new Error("Unknown domain status: " + this.props.status);
    }
  }
}
