import * as React from 'react';
import {Page} from "../../../../components/Page/";
import {KeyboardEvent, ReactNode} from "react";
import Tooltip from "antd/es/tooltip";
import {Button, Card, Icon, Input, notification, Popconfirm, Table} from "antd";
import styles from "./styles.module.css";
import {CartTitleToolbar} from "../../../../components/CardTitleToolbar/";
import {RouteComponentProps} from "react-router";
import {makeCancelable, PromiseSubscription} from "../../../../utils/make-cancelable";
import {injectAs} from "../../../../utils/mobx-utils";
import {SERVICES} from "../../../../services/ServiceConstants";
import {Link} from "react-router-dom";
import {DomainBreadcrumbProducer} from "../../DomainBreadcrumProducer";
import {DomainId} from "../../../../models/DomainId";
import {toDomainUrl} from "../../../../utils/domain-url";
import {DomainGroupService} from "../../../../services/domain/DomainGroupService";
import {DomainUserGroupSummary} from "../../../../models/domain/DomainUserGroupSummary";

interface DomainUserGroupsProps extends RouteComponentProps {
  domainId: DomainId;
}

interface InjectedProps extends DomainUserGroupsProps {
  domainGroupService: DomainGroupService;
}

interface DomainGroupsState {
  groups: DomainUserGroupSummary[] | null;
  groupFilter: string;
}

export class DomainUserGroupsComponent extends React.Component<InjectedProps, DomainGroupsState> {
  private readonly _breadcrumbs: DomainBreadcrumbProducer;
  private readonly _groupTableColumns: any[];
  private _groupsSubscription: PromiseSubscription | null;

  constructor(props: InjectedProps) {
    super(props);

    this._breadcrumbs = new DomainBreadcrumbProducer(this.props.domainId, [{title: "Groups"}]);

    this._groupTableColumns = [{
      title: 'Id',
      dataIndex: 'id',
      sorter: (a: DomainUserGroupSummary, b: DomainUserGroupSummary) => (a.id as string).localeCompare(b.id),
      render: (text: string) => <Link to={toDomainUrl("", this.props.domainId,`groups/${text}`)}>{text}</Link>
    }, {
      title: 'Description',
      dataIndex: 'description',
      sorter: (a: DomainUserGroupSummary, b: DomainUserGroupSummary) => (a.description as string).localeCompare(b.description)
    }, {
      title: 'Members',
      dataIndex: 'members',
      sorter: (a: DomainUserGroupSummary, b: DomainUserGroupSummary) => a.members - b.members
    }, {
      title: '',
      align: 'right',
      width: 80,
      render: this._renderActions
    }];

    this._groupsSubscription = null;

    this.state = {
      groups: null,
      groupFilter: ""
    };

    this._loadGroups();
  }

  public componentWillUnmount(): void {
    if (this._groupsSubscription) {
      this._groupsSubscription.unsubscribe();
      this._groupsSubscription = null;
    }
  }

  private _renderToolbar(): ReactNode {
    return (
      <CartTitleToolbar title="Groups" icon="group">
        <span className={styles.search}>
          <Input placeholder="Search Groups" addonAfter={<Icon type="search"/>} onKeyUp={this._onFilterChange}/>
        </span>
        <Tooltip placement="topRight" title="Create User" mouseEnterDelay={1}>
          <Button className={styles.iconButton} shape="circle" size="small" htmlType="button"
                  onClick={this._goToCreate}>
            <Icon type="plus-circle"/>
          </Button>
        </Tooltip>
        <Tooltip placement="topRight" title="Reload Groups" mouseEnterDelay={1}>
          <Button className={styles.iconButton} shape="circle" size="small" htmlType="button"
                  onClick={this._loadGroups}>
            <Icon type="reload"/>
          </Button>
        </Tooltip>
      </CartTitleToolbar>
    )
  }

  private _onFilterChange = (event: KeyboardEvent<HTMLInputElement>) => {
    this.setState({groupFilter: (event.target as HTMLInputElement).value}, this._loadGroups);
  }

  private _goToCreate = () => {
    const url = toDomainUrl("", this.props.domainId, "create-group");
    this.props.history.push(url);
  }

  public render(): ReactNode {
    return (
      <Page breadcrumbs={this._breadcrumbs}>
        <Card title={this._renderToolbar()}>
          <Table className={styles.groupTable}
                 size="middle"
                 rowKey="id"
                 columns={this._groupTableColumns}
                 dataSource={this.state.groups || []}
          />
        </Card>
      </Page>
    );
  }

  private _renderActions = (_: undefined, record: DomainUserGroupSummary) => {
    return (
      <span className={styles.actions}>
        <Tooltip placement="topRight" title="Edit User" mouseEnterDelay={1}>
          <Link to={toDomainUrl("", this.props.domainId, `groups/${record.id}`)}>
            <Button shape="circle" size="small" htmlType="button" icon="edit"/>
          </Link>
        </Tooltip>
        <Popconfirm title="Are you sure delete this group?"
                    placement="topRight"
                    onConfirm={() => this._onDeleteGroup(record.id)}
                    okText="Yes"
                    cancelText="No"
                    icon={<Icon type="question-circle-o" style={{color: 'red'}}/>}
        >
        <Tooltip placement="topRight" title="Delete User" mouseEnterDelay={2}>
          <Button shape="circle" size="small" htmlType="button" icon="delete"/>
        </Tooltip>
      </Popconfirm>
    </span>
    );
  }

  private _onDeleteGroup = (id: string) => {
    this.props.domainGroupService.removeUserGroup(this.props.domainId, id)
      .then(() => {
        this._loadGroups();
        notification.success({
          message: 'Group Deleted',
          description: `The group '${id}' was deleted.`,
        });
      })
      .catch(err => {
        console.error(err);
        notification.error({
          message: 'Could Not Delete User',
          description: `The group could not be deleted.`,
        });
      });
  }

  private _loadGroups = () => {
    const filter = this.state.groupFilter !== "" ? this.state.groupFilter : undefined;
    const {promise, subscription} = makeCancelable(this.props.domainGroupService.getUserGroupSummaries(this.props.domainId, filter));
    this._groupsSubscription = subscription;
    promise.then(groups => {
      this._groupsSubscription = null;
      this.setState({groups});
    }).catch(err => {
      this._groupsSubscription = null;
      this.setState({groups: null});
    });
  }
}

const injections = [SERVICES.DOMAIN_GROUP_SERVICE];
export const DomainUserGroups = injectAs<DomainUserGroupsProps>(injections, DomainUserGroupsComponent);
