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
