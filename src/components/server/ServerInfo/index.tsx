import * as React from 'react';
import {Component, ReactNode} from "react";
import styles from "./styles.module.css";
import {Card, Icon} from "antd";
import {InfoTable, InfoTableRow} from "../InfoTable";

export class ServerInfo extends Component<{}, {}> {
  constructor(props: any) {
    super(props);
  }

  public render(): ReactNode {
    return (
      <Card className={styles.info} title={<span><Icon type="profile"/> Server Info</span>}>
        <InfoTable>
          <InfoTableRow label="Version">1.0.0-rc.1</InfoTableRow>
          <InfoTableRow label="Edition">Development</InfoTableRow>
          <InfoTableRow label="Total Connections">23</InfoTableRow>
          <InfoTableRow label="Something Else">23</InfoTableRow>
          <InfoTableRow label="Status">Healthy <Icon type="check-circle" style={{color: "green"}}/></InfoTableRow>
        </InfoTable>
      </Card>
    );
  }
}
