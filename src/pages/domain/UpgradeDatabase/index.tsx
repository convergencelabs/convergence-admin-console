/*
 * Copyright (c) 2021 - Convergence Labs, Inc.
 *
 * This file is part of the Convergence Server, which is released under
 * the terms of the GNU General Public License version 3 (GPLv3). A copy
 * of the GPLv3 should have been provided along with this file, typically
 * located in the "LICENSE" file, which is part of this source code package.
 * Alternatively, see <https://www.gnu.org/licenses/gpl-3.0.html> for the
 * full text of the GPLv3 license, if it was not provided.
 */

import * as React from 'react';
import {ReactElement, ReactNode} from 'react';
import {DomainId} from "../../../models/DomainId";
import {SERVICES} from "../../../services/ServiceConstants";
import {injectAs} from "../../../utils/mobx-utils";
import {Button, Card, notification, Result, Spin} from "antd";
import {IBreadcrumbSegment} from "../../../stores/BreacrumsStore";
import {Page} from "../../../components";
import styles from "./styles.module.css"
import {DescriptionBox} from "../../../components/common/DescriptionBox";
import {FormButtonBar} from "../../../components/common/FormButtonBar";
import {SchemaService} from "../../../services/SchemaService";
import {toDomainRoute} from "../../../utils/domain-url";
import {STORES} from "../../../stores/StoreConstants";
import {ActiveDomainStore} from "../../../stores/ActiveDomainStore";
import {DomainStatus} from "../../../models/DomainStatus";
import {Redirect} from "react-router";
import {Link} from "react-router-dom";

export interface UpgradeDomainProps {
  domainId: DomainId;
}

interface InjectedProps extends UpgradeDomainProps {
  schemaService: SchemaService;
  activeDomainStore: ActiveDomainStore;
}

interface UpgradeDomainState {
  initiated: boolean;
}

class UpgradeDomainComponent extends React.Component<InjectedProps, UpgradeDomainState> {

  private readonly _breadcrumbs: IBreadcrumbSegment[];

  constructor(props: InjectedProps) {
    super(props);
    this._breadcrumbs = [
      {title: "Upgrade Domain"}
    ];

    this.state = {
      initiated: false
    }
  }

  public render(): ReactNode {
    const domainDescriptor = this.props.activeDomainStore.domainDescriptor!;
    const {status} = domainDescriptor;

    let component;

    if (status === DomainStatus.READY && this.state.initiated) {
      component = this._renderDone();
    } else if (status === DomainStatus.SCHEMA_UPGRADE_REQUIRED && !this.state.initiated) {
      component = this._renderConfirmUpgrade();
    } else if (status === DomainStatus.SCHEMA_UPGRADE_REQUIRED || status === DomainStatus.SCHEMA_UPGRADING) {
      component = this._renderInProgress();
    } else if (status === DomainStatus.ERROR) {
      component = this._renderError()
    } else {
      return <Redirect to={toDomainRoute(domainDescriptor.domainId, "")}/>
    }

    return (
        <Page breadcrumbs={this._breadcrumbs}>
          <Card title="Upgrade Domain" className={styles.upgradeCard}>
            {component}
          </Card>
        </Page>
    );
  }

  private _renderDone(): ReactElement {
    return (
        <Result
            status="success"
            title="Domain Database is Ready"
            extra={[
              <Link to={toDomainRoute(this.props.domainId, "")}>
                <Button type="primary" key="console">Go To Domain Dashboard</Button>
              </Link>
            ]}
        />
    );
  }

  private _renderError(): ReactElement {
    return (
        <Result
            status="error"
            title=" Upgrading the Database Failed"
            extra={[
              <div>Information on the failure can be found below.  Please consult the server logs for additional details.</div>
            ]}
        >
          <pre>
          {this.props.activeDomainStore.domainDescriptor?.statusMessage}
          </pre>

        </Result>
    );
  }

  private _renderInProgress(): ReactElement {
    return (
        <Result
            title="Domain Database Upgrade in Progress"
            icon={<Spin size="large"/>}
        />
    );
  }

  private _renderConfirmUpgrade(): ReactElement {
    return (
        <React.Fragment>
          <DescriptionBox>
            The database for this domain is out of date and needs to
            be updated before the Domain can be used. It is strongly
            recommended that you backup your database before proceeding
            with the upgrade.
          </DescriptionBox>
          <FormButtonBar>
            <Button type="primary" onClick={this._onUpgrade}>Upgrade Database</Button>
          </FormButtonBar>
        </React.Fragment>

    );
  }

  private _onUpgrade = () => {
    this.props.schemaService.upgradeDomain(this.props.domainId)
        .then(() => {
          notification.success({
            message: 'Domain Upgrade Started',
            description: 'The domain upgrade was successfully started.',
          });
        })
        .then(() => {
          this.setState({initiated: true});
          return this.props.activeDomainStore.refreshDomainDescriptor();
        })
        .catch(err => {
          console.error(err);
          notification.error({
            message: 'Could Not Start Upgrade',
            description: `The upgrade could not be started, check the console log.`,
          });
        });
  }
}

const injections = [SERVICES.SCHEMA_SERVICE, STORES.ACTIVE_DOMAIN_STORE];
export const UpgradeDomain = injectAs<UpgradeDomainProps>(injections, UpgradeDomainComponent);

