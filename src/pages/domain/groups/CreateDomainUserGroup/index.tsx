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

import {Page} from "../../../../components";
import React, {ReactNode} from "react";
import { TeamOutlined } from '@ant-design/icons';
import { Card, notification } from "antd";
import styles from "./styles.module.css";
import {RouteComponentProps} from "react-router";
import {injectAs} from "../../../../utils/mobx-utils";
import {SERVICES} from "../../../../services/ServiceConstants";
import {DomainId} from "../../../../models/DomainId";
import {toDomainRoute} from "../../../../utils/domain-url";
import {DomainUserGroupForm} from "../../../../components/domain/group/DomainUserGroupForm/";
import {DomainGroupService} from "../../../../services/domain/DomainGroupService";
import {DomainUserGroup} from "../../../../models/domain/DomainUserGroup";
import {RestError} from "../../../../services/RestError";

export interface CreateDomainUserGroupProps extends RouteComponentProps {
  domainId: DomainId;
}

interface InjectedProps extends CreateDomainUserGroupProps {
  domainGroupService: DomainGroupService;
}

class CreateDomainUserGroupComponent extends React.Component<InjectedProps, {}> {
  private readonly _breadcrumbs = [
    {title: "Groups", link: toDomainRoute(this.props.domainId, "groups/")},
    {title: "New Group"}
  ];
  private readonly _newGroup = new DomainUserGroup("", "", []);

  public render(): ReactNode {
    return (
      <Page breadcrumbs={this._breadcrumbs}>
        <Card title={<span><TeamOutlined /> New Group</span>} className={styles.formCard}>
          <DomainUserGroupForm
            domainId={this.props.domainId}
            saveButtonLabel="Create"
            initialValue={this._newGroup}
            onCancel={this._handleCancel}
            onSave={this._handleSave}
          />
        </Card>
      </Page>
    );
  }

  private _handleCancel = () => {
    const url = toDomainRoute(this.props.domainId, "groups/");
    this.props.history.push(url);
  }

  private _handleSave = (group: DomainUserGroup) => {
    this.props.domainGroupService.createUserGroup(this.props.domainId, group)
      .then(() => {
        notification.success({
          message: 'Group Created',
          description: `Group '${group.id}' successfully created.`
        });
        const url = toDomainRoute(this.props.domainId, "groups/");
        this.props.history.push(url);
      }).catch((err) => {
      if (err instanceof RestError) {
        if (err.code === "duplicate") {
          notification.error({
            message: 'Could Not Create Group',
            description: `A group with the specified ${err.details["field"]} already exists.`
          });
        }
      }
    });
  }

}

const injections = [SERVICES.DOMAIN_GROUP_SERVICE];
export const CreateDomainUserGroup = injectAs<CreateDomainUserGroupProps>(injections, CreateDomainUserGroupComponent);
