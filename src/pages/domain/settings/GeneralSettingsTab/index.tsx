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
import {Card} from "antd";
import {DomainId} from "../../../../models/DomainId";
import {ModelSnapshotPolicySettings} from "../../../../components/domain/settings/ModelSnapshotPolicySettings"
import {DomainBasicSettings} from "../../../../components/domain/settings/DomainBasicSettings";
import styles from "./styles.module.css";

export interface DomainSettingsProps {
  domainId: DomainId;
}

export class DomainGeneralSettingsTab extends React.Component<DomainSettingsProps, {}> {
  public render(): ReactNode {
    return (
      <div className={styles.generalSettings}>
        <Card type="inner" title="Basic Information">
          <DomainBasicSettings domainId={this.props.domainId} />
        </Card>
        <Card type="inner" title="Model Snapshot Policy">
          <ModelSnapshotPolicySettings domainId={this.props.domainId} />
        </Card>
      </div>
    );
  }
}
