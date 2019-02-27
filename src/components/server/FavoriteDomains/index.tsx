import React, {ReactNode} from "react";
import {DomainDescriptor} from "../../../models/DomainDescriptor";
import {Card, Col, Icon, Row} from "antd";
import {injectAs} from "../../../utils/mobx-utils";
import {DomainCard} from "../DomainCard/";
import {makeCancelable, PromiseSubscription} from "../../../utils/make-cancelable";
import {SERVICES} from "../../../services/ServiceConstants";
import {LoggedInUserService} from "../../../services/LoggedInUserService";
import {Link} from "react-router-dom";
import styles from "./styles.module.css";

export interface RecentDomainInjectedProps {
  loggedInUserService: LoggedInUserService
}

export interface RecentDomainState {
  domains: DomainDescriptor[] | null;
  error: boolean;
}

export class FavoriteDomainsComponent extends React.Component<RecentDomainInjectedProps, RecentDomainState> {
  private readonly _loadingSubscription: PromiseSubscription;

  constructor(props: RecentDomainInjectedProps) {
    super(props);

    this.state = {
      domains: null,
      error: false
    };

    const {promise, subscription} = makeCancelable(this.props.loggedInUserService.getFavoriteDomains());
    promise
      .then(domains => {
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
    const domains = this.state.domains || [];
    return (
      <Card title={<span><Icon type="database"/> Favorite Domains</span>}>
        {
          domains.length > 0 ?
            (<Row gutter={16}>
              {(domains).map((d: DomainDescriptor) => (
                <Col xxl={8} xl={12} lg={24} md={24} sm={24} key={`${d.namespace}/${d.id}`}>
                  <DomainCard domain={d}/>
                </Col>
              ))}
            </Row>) :
            <div className={styles.noDomains}>
              <div className={styles.centered}>
                <Icon className={styles.icon} type="database"/>
                <div>No Favorite Domains</div>
                <div>(Select One <Link to={"/domains"}>Here</Link>)</div>
              </div>
            </div>
        }
      </Card>
    );
  }
}

export const RecentDomains = injectAs<{}>([SERVICES.LOGGED_IN_USER_SERVICE], FavoriteDomainsComponent);
