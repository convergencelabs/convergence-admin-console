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
import {DomainDescriptor} from "../../../models/DomainDescriptor";
import { DatabaseOutlined } from '@ant-design/icons';
import { Card, Col, Row } from "antd";
import {injectAs} from "../../../utils/mobx-utils";
import {DomainCard} from "../DomainCard/";
import {makeCancelable, PromiseSubscription} from "../../../utils/make-cancelable";
import {SERVICES} from "../../../services/ServiceConstants";
import {LoggedInUserService} from "../../../services/LoggedInUserService";
import {Link} from "react-router-dom";
import styles from "./styles.module.css";
import {DomainStatus} from "../../../models/DomainStatus";

export interface RecentDomainInjectedProps {
  loggedInUserService: LoggedInUserService
}

export interface RecentDomainState {
  domains: DomainDescriptor[] | null;
  error: boolean;
}

export class FavoriteDomainsComponent extends React.Component<RecentDomainInjectedProps, RecentDomainState> {
  private _loadingSubscription: PromiseSubscription | null;
  private _reloadInterval: any = null;

  constructor(props: RecentDomainInjectedProps) {
    super(props);

    this.state = {
      domains: null,
      error: false
    };

    this._loadingSubscription = null;

    this._loadDomains();
  }

  public componentWillUnmount(): void {
    if (this._loadingSubscription !== null) {
      this._loadingSubscription.unsubscribe();
      this._loadingSubscription = null;
    }
  }

  public render(): ReactNode {
    const domains = this.state.domains || [];
    return (
      <Card title={<span><DatabaseOutlined /> Favorite Domains</span>}>
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
                <DatabaseOutlined className={styles.icon} />
                <div>No Favorite Domains</div>
                <div>(Select One <Link to={"/domains"}>Here</Link>)</div>
              </div>
            </div>
        }
      </Card>
    );
  }

  private _loadDomains = () =>  {
    const {promise, subscription} = makeCancelable(this.props.loggedInUserService.getFavoriteDomains());
    this._loadingSubscription = subscription;
    promise
      .then(domains => {
        this.setState({domains});

        this._loadingSubscription = null;
        if (this._reloadInterval !== null) {
          clearTimeout(this._reloadInterval);
          this._reloadInterval = null;
        }

        if (domains.find(d => d.status === DomainStatus.INITIALIZING || d.status === DomainStatus.DELETING)) {
          this._reloadInterval = setInterval(this._loadDomains, 5000);
        }
      })
      .catch(error => {
        this._loadingSubscription = null;
        this.setState({error: true});
      });
  }
}

export const FavoriteDomains = injectAs<{}>([SERVICES.LOGGED_IN_USER_SERVICE], FavoriteDomainsComponent);
