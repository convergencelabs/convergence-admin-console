import React, {ReactNode} from "react";
import {DomainService} from "../../../../services/DomainService";
import {makeCancelable, PromiseSubscription} from "../../../../utils/make-cancelable";
import {DomainId} from "../../../../models/DomainId";
import {InfoTable, InfoTableRow} from "../../../../components/server/InfoTable";
import {injectAs} from "../../../../utils/mobx-utils";
import {SERVICES} from "../../../../services/ServiceConstants";
import {DomainStatistics} from "../../../../models/domain/DomainStatistics";
import {formatBytes} from "../../../../utils/format-utils";

export interface DomainStatsProps {
  domainId: DomainId;
}

interface InjectedProps extends DomainStatsProps {
  domainService: DomainService;
}

interface DomainStatsState {
  domainStats: DomainStatistics | null;
}

export class DomainStatsComponent extends React.Component<InjectedProps, DomainStatsState> {

  private _domainStatsSubscription: PromiseSubscription | null;

  constructor(props: InjectedProps) {
    super(props);

    this.state = {
      domainStats: null
    };

    this._domainStatsSubscription = null;

    this._loadDomain();
  }

  public componentWillUnmount(): void {
    if (this._domainStatsSubscription !== null) {
      this._domainStatsSubscription.unsubscribe();
    }
  }

  public render(): ReactNode {
    const {domainStats} = this.state;
    return domainStats !== null ?
      (
        <InfoTable>
          <InfoTableRow label="Active Sessions">{domainStats.activeSessionCount}</InfoTableRow>
          <InfoTableRow label="Total Users">{domainStats.userCount}</InfoTableRow>
          <InfoTableRow label="Total Models">{domainStats.modelCount}</InfoTableRow>
          <InfoTableRow label="Storage">{formatBytes(domainStats.dbSize, 1)}</InfoTableRow>
        </InfoTable>
      ) :
      null;
  }

  private _loadDomain(): void {
    const {promise, subscription} = makeCancelable(this.props.domainService.getDomainStats(this.props.domainId));
    this._domainStatsSubscription = subscription;
    promise.then(domainStats => {
      this._domainStatsSubscription = null;
      this.setState({domainStats});
    }).catch(err => {
      this._domainStatsSubscription = null;
      this.setState({domainStats: null});
    });
  }
}

const injections = [SERVICES.DOMAIN_SERVICE];
export const DomainStats = injectAs<DomainStatsProps>(injections, DomainStatsComponent);
