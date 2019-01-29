import * as React from 'react';
import {Component, ReactNode} from "react";
import styles from "./styles.module.css";
import {DomainService} from "../../services/DomainService";
import {DomainDescriptor} from "../../models/DomainDescriptor";
import {Card, Col, Icon} from "antd";
import {injectAs} from "../../utils/mobx-utils";
import {DomainCard} from "../DomainCard";
import {makeCancelable, PromiseSubscription} from "../../utils/make-cancelable";

export interface RecentDomainInjectedProps {
  domainService: DomainService
}

export interface RecentDomainState {
  domains: DomainDescriptor[] | null;
  error: boolean;
}

export class FavoriteDomainsComponent extends Component<RecentDomainInjectedProps, RecentDomainState> {
  private readonly _loadingSubscription: PromiseSubscription;

  constructor(props: RecentDomainInjectedProps) {
    super(props);

    this.state = {
      domains: null,
      error: false
    };

    const {promise, subscription} = makeCancelable(this.props.domainService.getDomains());
    promise.then(domains => {
        this.setState({domains});
      })
      .catch(error => {
        this.setState({error: true});
      });

    this._loadingSubscription = subscription;
  }

  public componentWillUnmount(): void {
    this._loadingSubscription.unsubscribe();
  }

  public render(): ReactNode {
    return (
      <Card title={<span><Icon type="database"/> Favorite Domains</span>}>
        {

          (this.state.domains || []).map((d: DomainDescriptor) => (
            <Col span={8} key={`${d.namespace}/${d.id}`}>
              <DomainCard domain={d}/>
            </Col>
          ))
        }
      </Card>
    );
  }
}

export const RecentDomains = injectAs<{}>(["domainService"], FavoriteDomainsComponent);
