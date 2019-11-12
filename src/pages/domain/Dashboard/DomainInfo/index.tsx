/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React, {ReactNode} from "react";
import {DomainService} from "../../../../services/DomainService";
import {DomainDescriptor} from "../../../../models/DomainDescriptor";
import {makeCancelable, PromiseSubscription} from "../../../../utils/make-cancelable";
import {DomainId} from "../../../../models/DomainId";
import {InfoTable, InfoTableRow} from "../../../../components/server/InfoTable";
import {injectAs} from "../../../../utils/mobx-utils";
import {SERVICES} from "../../../../services/ServiceConstants";
import {formatDomainStatus} from "../../../../utils/format-utils";
import {DomainStatusIcon} from "../../../../components/common/DomainStatusIcon";
import {STORES} from "../../../../stores/StoreConstants";
import {ConfigStore} from "../../../../stores/ConfigStore";

export interface DomainInfoProps {
  domainId: DomainId;
}

interface InjectedProps extends DomainInfoProps {
  domainService: DomainService;
  configStore: ConfigStore;
}

interface DomainInfoState {
  domain: DomainDescriptor | null;
}

export class DomainInfoComponent extends React.Component<InjectedProps, DomainInfoState> {

  private _domainSubscription: PromiseSubscription | null;

  constructor(props: InjectedProps) {
    super(props);

    this.state = {
      domain: null
    };

    this._domainSubscription = null;

    this._loadDomain();
  }

  public componentWillUnmount(): void {
    if (this._domainSubscription !== null) {
      this._domainSubscription.unsubscribe();
    }
  }

  public render(): ReactNode {
    const {domain} = this.state;
    return domain !== null ?
      (
        <InfoTable>
          <InfoTableRow label="Display Name">{domain.displayName}</InfoTableRow>
          <InfoTableRow label="Namespace">{domain.namespace}</InfoTableRow>
          <InfoTableRow label="Id">{domain.id}</InfoTableRow>
          <InfoTableRow label="Status">
            <span style={{marginRight: 10}}>{formatDomainStatus(domain.status)}</span>
            <DomainStatusIcon status={domain.status}/>
          </InfoTableRow>
        </InfoTable>
      ) :
      null;
  }

  private _loadDomain(): void {
    const {promise, subscription} = makeCancelable(this.props.domainService.getDomain(this.props.domainId));
    this._domainSubscription = subscription;
    promise.then(domain => {
      this._domainSubscription = null;
      this.setState({domain});
    }).catch(err => {
      this._domainSubscription = null;
      this.setState({domain: null});
    });
  }
}

const injections = [SERVICES.DOMAIN_SERVICE, STORES.CONFIG_STORE];
export const DomainInfo = injectAs<DomainInfoProps>(injections, DomainInfoComponent);
