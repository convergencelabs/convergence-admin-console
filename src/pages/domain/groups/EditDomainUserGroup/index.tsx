import {Page} from "../../../../components/Page/";
import React, {ReactNode} from "react";
import {Card, notification, Icon} from "antd";
import {FormComponentProps} from "antd/lib/form";
import styles from "./styles.module.css";
import {RouteComponentProps} from "react-router";
import {injectAs} from "../../../../utils/mobx-utils";
import {SERVICES} from "../../../../services/ServiceConstants";
import {DomainBreadcrumbProducer} from "../../DomainBreadcrumProducer";
import {DomainId} from "../../../../models/DomainId";
import {toDomainUrl} from "../../../../utils/domain-url";
import {DomainUserGroupForm} from "../../../../components/domain/group/DomainUserGroupForm/";
import {DomainGroupService} from "../../../../services/domain/DomainGroupService";
import {DomainUserGroup} from "../../../../models/domain/DomainUserGroup";
import {RestError} from "../../../../services/RestError";
import {makeCancelable, PromiseSubscription} from "../../../../utils/make-cancelable";

interface EditDomainUserGroupProps extends RouteComponentProps<{id: string}> {
  domainId: DomainId;
}

interface InjectedProps extends EditDomainUserGroupProps, FormComponentProps {
  domainGroupService: DomainGroupService;
}

interface EditDomainUserGroupState {
  initialGroup: DomainUserGroup | null;
}

class EditDomainUserGroupComponent extends React.Component<InjectedProps, EditDomainUserGroupState> {
  private readonly _breadcrumbs: DomainBreadcrumbProducer;
  private _groupSubscription: PromiseSubscription | null;

  constructor(props: InjectedProps) {
    super(props);

    const groupsUrl = toDomainUrl("", this.props.domainId, "groups/");
    this._breadcrumbs = new DomainBreadcrumbProducer(this.props.domainId, [
      {title: "Groups", link: toDomainUrl("", this.props.domainId, groupsUrl)},
      {title: this.props.match.params.id}
    ]);

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
    const url = toDomainUrl("", this.props.domainId, "groups/");
    this.props.history.push(url);
  }

  private _handleSave = (group: DomainUserGroup) => {
    this.props.domainGroupService.updateUserGroup(this.props.domainId, this.props.match.params.id, group)
      .then(() => {
        notification.success({
          message: 'Group Editd',
          description: `User '${group.id}' successfully created.`
        });
        const url = toDomainUrl("", this.props.domainId, "groups/");
        this.props.history.push(url);
      }).catch((err) => {
      if (err instanceof RestError) {
        if (err.code === "duplicate") {
          notification.error({
            message: 'Could Not Edit Group',
            description: `A user with the specified ${err.details["field"]} already exists.`
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

    promise.then(collection => {
      this.setState({initialGroup: collection});
    })
  }

}

const injections = [SERVICES.DOMAIN_GROUP_SERVICE];
export const EditDomainUserGroup = injectAs<EditDomainUserGroupProps>(injections, EditDomainUserGroupComponent);
