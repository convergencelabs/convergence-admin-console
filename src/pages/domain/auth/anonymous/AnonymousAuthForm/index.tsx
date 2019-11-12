/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React, {ReactNode} from "react";
import {Spin, Switch} from 'antd';
import {DomainId} from "../../../../../models/DomainId";
import {DescriptionBox} from "../../../../../components/common/DescriptionBox";
import {makeCancelable, PromiseSubscription} from "../../../../../utils/make-cancelable";
import styles from "./styles.module.css";
import {injectAs} from "../../../../../utils/mobx-utils";
import {SERVICES} from "../../../../../services/ServiceConstants";
import {DomainConfigService} from "../../../../../services/domain/DomainConfigService";

export interface AnonymousAuthFormProps {
  domainId: DomainId;
}

interface InjectedProps extends AnonymousAuthFormProps {
  domainConfigService: DomainConfigService;
}

export interface AnonymousAuthFormState {
  enabled: boolean | null;
  loading: boolean;
}

class AnonymousAuthFormComponent extends React.Component<InjectedProps, AnonymousAuthFormState> {
  private _subscription: PromiseSubscription | null;

  constructor(props: InjectedProps) {
    super(props);

    this.state = {
      enabled: null,
      loading: true
    };

    this._subscription = null;
  }

  public componentDidMount(): void {
    this._loadAnonymousAuthEnabled();
  }

  public componentWillUnmount(): void {
    if (this._subscription !== null) {
      this._subscription.unsubscribe();
      this._subscription = null
    }
  }

  public render(): ReactNode {
    return (
      <Spin spinning={this.state.loading}>
        <div className={styles.anonymousAuth}>
          <DescriptionBox>
            <p>
              Anonymous authentication allows clients to connect to the system without providing any user credentials.
              Since the connecting client provides no credentials, the system will not know who the user is. The user
              will not have a meaningful identity in the system.
            </p>
            <span className={styles.warning}>Warning: Enabling anonymous authentication will allow anyone to connect to the system.</span>
          </DescriptionBox>
          <div className={styles.controls}>
            <span className={styles.label}>Anonymous Authentication: </span>
            <Switch loading={this.state.loading} checked={this.state.enabled!} onChange={this._onChange}/>
            <span className={styles.enabled}>{this.state.enabled ? "Enabled" : "Disabled"}</span>
          </div>
        </div>
      </Spin>
    );
  }

  private _onChange = (checked: boolean) => {
    this.setState({enabled: checked, loading: true});
    const {promise, subscription} = makeCancelable(
      this.props.domainConfigService.setAnonymousAuthEnabled(this.props.domainId, checked));
    this._subscription = subscription;
    promise.then(() => {
        this.setState({loading: false});
        this._subscription = null;
      }
    );
  }

  private _loadAnonymousAuthEnabled = () => {
    this.setState({loading: true});
    const {promise, subscription} = makeCancelable(
      this.props.domainConfigService.getAnonymousAuthEnabled(this.props.domainId));
    this._subscription = subscription;
    promise.then(enabled => {
        this.setState({loading: false, enabled});
        this._subscription = null;
      }
    );
  }
}

const injections = [SERVICES.DOMAIN_CONFIG_SERVICE];
export const AnonymousAuthForm = injectAs<AnonymousAuthFormProps>(injections, AnonymousAuthFormComponent);