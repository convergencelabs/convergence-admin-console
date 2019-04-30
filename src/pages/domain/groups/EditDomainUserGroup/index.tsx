import React, {ReactNode} from "react";
import {Page} from "../../../../components/common/Page/";
import {Card, notification, Icon} from "antd";
import {FormComponentProps} from "antd/lib/form";
import {RouteComponentProps} from "react-router";
import {injectAs} from "../../../../utils/mobx-utils";
import {SERVICES} from "../../../../services/ServiceConstants";
import {DomainId} from "../../../../models/DomainId";
import {toDomainRoute} from "../../../../utils/domain-url";
import {DomainUserGroupForm} from "../../../../components/domain/group/DomainUserGroupForm/";
import {DomainGroupService} from "../../../../services/domain/DomainGroupService";
import {DomainUserGroup} from "../../../../models/domain/DomainUserGroup";
import {RestError} from "../../../../services/RestError";
import {makeCancelable, PromiseSubscription} from "../../../../utils/make-cancelable";
import styles from "./styles.module.css";

export interface EditDomainUserGroupProps extends RouteComponentProps<{id: string}> {
  domainId: DomainId;
}

interface InjectedProps extends EditDomainUserGroupProps, FormComponentProps {
  domainGroupService: DomainGroupService;
}

export interface EditDomainUserGroupState {
  initialGroup: DomainUserGroup | null;
}

class EditDomainUserGroupComponent extends React.Component<InjectedProps, EditDomainUserGroupState> {
  private readonly _breadcrumbs = [
    {title: "Groups", link: toDomainRoute(this.props.domainId, "groups/")},
    {title: this.props.match.params.id}
  ];
  private _groupSubscription: PromiseSubscription | null;

  constructor(props: InjectedProps) {
    super(props);

    this.state = {
      initialGroup: null
    };

    this._groupSubscription = null;
    this._loadGroup();
  }

  public render(): ReactNode {
    if (this.state.initialGroup !== null) {
      return (
        <Page breadcrumbs={this._breadcrumbs}>
          <Card title={<span><Icon type="team"/> New Group</span>} className={styles.formCard}>
            <DomainUserGroupForm
              domainId={this.props.domainId}
              saveButtonLabel="Save"
              initialValue={this.state.initialGroup}
              onCancel={this._handleCancel}
              onSave={this._handleSave}
            />
          </Card>
        </Page>
      );
    } else {
      return null;
    }
  }

  private _handleCancel = () => {
    const url = toDomainRoute(this.props.domainId, "groups/");
    this.props.history.push(url);
  }

  private _handleSave = (group: DomainUserGroup) => {
    this.props.domainGroupService.updateUserGroup(this.props.domainId, this.props.match.params.id, group)
      .then(() => {
        notification.success({
          message: 'Group Updated',
          description: `Group '${group.id}' successfully created.`
        });
        const url = toDomainRoute(this.props.domainId, "groups/");
        this.props.history.push(url);
      }).catch((err) => {
      if (err instanceof RestError) {
        if (err.code === "duplicate") {
          notification.error({
            message: 'Could Not Edit Group',
            description: `A group with the specified ${err.details["field"]} already exists.`
          });
        }
      }
    });
  }

  private _loadGroup(): void {
    const {id} = this.props.match.params;
    const {promise, subscription} = makeCancelable(
      this.props.domainGroupService.getUserGroup(this.props.domainId, id)
    );

    this._groupSubscription = subscription;

    promise.then(group => {
      this.setState({initialGroup: group});
    });
  }
}

const injections = [SERVICES.DOMAIN_GROUP_SERVICE];
export const EditDomainUserGroup = injectAs<EditDomainUserGroupProps>(injections, EditDomainUserGroupComponent);
