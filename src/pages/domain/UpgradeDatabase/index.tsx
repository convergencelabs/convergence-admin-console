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

import * as React from 'react';
import {ReactNode} from 'react';
import {DomainId} from "../../../models/DomainId";
import {SERVICES} from "../../../services/ServiceConstants";
import {injectAs} from "../../../utils/mobx-utils";
import {Button, Card, notification} from "antd";
import {IBreadcrumbSegment} from "../../../stores/BreacrumsStore";
import {Page} from "../../../components";
import styles from "./styles.module.css"
import {DescriptionBox} from "../../../components/common/DescriptionBox";
import {FormButtonBar} from "../../../components/common/FormButtonBar";
import {SchemaService} from "../../../services/SchemaService";


export interface UpgradeDomainProps {
  domainId: DomainId;
}

interface InjectedProps extends UpgradeDomainProps {
  schemaService: SchemaService;
}


class UpgradeDomainComponent extends React.Component<InjectedProps> {

  private readonly _breadcrumbs: IBreadcrumbSegment[];

  constructor(props: InjectedProps) {
    super(props);
    this._breadcrumbs = [
      {title: "Upgrade Domain"}
    ];
  }

  public render(): ReactNode {
    return (
        <Page breadcrumbs={this._breadcrumbs}>
          <Card title="Upgrade Domain" className={styles.upgradeCard}>
            <DescriptionBox>
              The database for this domain is out of date and needs to
              be updated before the Domain can be used.  It is strongly
              recommended that you backup your database before proceeding
              with the upgrade.
            </DescriptionBox>
            <FormButtonBar>
              <Button type="primary" onClick={this._onUpgrade}>Upgrade Database</Button>
            </FormButtonBar>
          </Card>
        </Page>
    );
  }

  private _onUpgrade = () => {
    this.props.schemaService.upgradeDomain(this.props.domainId)
        .then(() => {
          notification.success({
            message: 'Domain Upgrade Started',
            description: 'The domain upgrade was successful started.',
          });
        })
        .catch(err => {
          console.error(err);
          notification.error({
            message: 'Could Not Delete User',
            description: `The user could not be deleted.`,
          });
        });
  }
}

const injections = [SERVICES.SCHEMA_SERVICE];
export const UpgradeDomain = injectAs<UpgradeDomainProps>(injections, UpgradeDomainComponent);

