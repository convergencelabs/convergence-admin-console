import {Page} from "../../../../components/common/Page/";
import React, {ReactNode} from "react";
import {Card, Icon, notification} from "antd";
import {FormComponentProps} from "antd/lib/form";
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

interface InjectedProps extends CreateDomainUserGroupProps, FormComponentProps {
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
        <Card title={<span><Icon type="team"/> New Group</span>} className={styles.formCard}>
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
