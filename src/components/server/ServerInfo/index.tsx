/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import * as React from 'react';
import {Component, ReactNode} from 'react';
import styles from "./styles.module.css";
import {Card, Icon} from "antd";
import {InfoTable, InfoTableRow} from "../InfoTable";
import {ServerStatus} from "../../../models/ServerStatus";
import {makeCancelable, PromiseSubscription} from "../../../utils/make-cancelable";
import {ServerStatusService} from "../../../services/ServerStatusService";
import {SERVICES} from "../../../services/ServiceConstants";
import {injectAs} from "../../../utils/mobx-utils";

export interface InjectedProps {
  serverStatusService: ServerStatusService;
}

export interface ServerInfoState {
  serverStatus: ServerStatus | null;
}

export class ServerInfoComponent extends Component<InjectedProps, ServerInfoState> {

  private _subscription: PromiseSubscription | null;

  constructor(props: InjectedProps) {
    super(props);

    this.state = {
      serverStatus: null
    };

    this._subscription = null;

    this._loadStatus();
  }

  public componentWillUnmount(): void {
    if (this._subscription !== null) {
      this._subscription.unsubscribe();
      this._subscription = null;
    }
  }

  public render(): ReactNode {
    const {serverStatus} = this.state;
    const contents = serverStatus !== null ?
      (
        <InfoTable>
          <InfoTableRow label="Version">{serverStatus.version}</InfoTableRow>
          <InfoTableRow label="Edition">{serverStatus.distribution}</InfoTableRow>
          <InfoTableRow label="Namespaces">{serverStatus.namespaces}</InfoTableRow>
          <InfoTableRow label="Domains">{serverStatus.domains}</InfoTableRow>
          <InfoTableRow label="Status">Healthy <Icon type="check-circle" style={{color: "green"}}/></InfoTableRow>
        </InfoTable>
      ) :
      null;

    return (
      <Card className={styles.info} title={<span><Icon type="profile"/> Server Info</span>}>
        {contents}
      </Card>
    );
  }

  private _loadStatus(): void {
    const {promise, subscription} = makeCancelable(this.props.serverStatusService.getStatus());
    this._subscription = subscription;
    promise.then(serverStatus => {
      this._subscription = null;
      this.setState({serverStatus});
    }).catch(err => {
      this._subscription = null;
      this.setState({serverStatus: null});
    });
  }
}

const injections = [SERVICES.SERVER_STATUS_SERVICE];
export const ServerInfo = injectAs<{}>(injections, ServerInfoComponent);

