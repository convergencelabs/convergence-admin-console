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
import {DomainService} from "../../../../services/DomainService";
import {DomainDescriptor} from "../../../../models/DomainDescriptor";
import {makeCancelable, PromiseSubscription} from "../../../../utils/make-cancelable";
import {DomainId} from "../../../../models/DomainId";
import {InfoTable, InfoTableRow} from "../../../../components/server/InfoTable";
import {injectAs} from "../../../../utils/mobx-utils";
import {SERVICES} from "../../../../services/ServiceConstants";
import {formatDomainAvailability, formatDomainStatus} from "../../../../utils/format-utils";
import {DomainStatusIcon} from "../../../../components/common/DomainStatusIcon";
import {STORES} from "../../../../stores/StoreConstants";
import {ConfigStore} from "../../../../stores/ConfigStore";
import {DomainAvailabilityIcon} from "../../../../components/common/DomainAvailabilityIcon";

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
          <InfoTableRow label="Schema Version">{domain.schemaVersion}</InfoTableRow>
          <InfoTableRow label="Availability / Status">
            <span style={{marginRight: 10}}>{formatDomainAvailability(domain.availability)}</span>
            <DomainAvailabilityIcon availability={domain.availability}/>
            <span> / </span>
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
