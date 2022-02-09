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

import React, {KeyboardEvent, ReactNode} from "react";
import {Page} from "../../../../components";
import Tooltip from "antd/es/tooltip";
import {
  DeleteOutlined,
  EditOutlined, GroupOutlined,
  PlusCircleOutlined,
  QuestionCircleOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button, Card, Input, notification, Popconfirm, Table } from "antd";
import styles from "./styles.module.css";
import {CardTitleToolbar} from "../../../../components/common/CardTitleToolbar/";
import {RouteComponentProps} from "react-router";
import {makeCancelable, PromiseSubscription} from "../../../../utils/make-cancelable";
import {injectAs} from "../../../../utils/mobx-utils";
import {SERVICES} from "../../../../services/ServiceConstants";
import {Link} from "react-router-dom";
import {DomainId} from "../../../../models/DomainId";
import {toDomainRoute} from "../../../../utils/domain-url";
import {DomainGroupService} from "../../../../services/domain/DomainGroupService";
import {DomainUserGroupSummary} from "../../../../models/domain/DomainUserGroupSummary";

export interface DomainUserGroupsProps extends RouteComponentProps {
  domainId: DomainId;
}

interface InjectedProps extends DomainUserGroupsProps {
  domainGroupService: DomainGroupService;
}

export interface DomainGroupsState {
  groups: DomainUserGroupSummary[] | null;
  groupFilter: string;
}

class DomainUserGroupsComponent extends React.Component<InjectedProps, DomainGroupsState> {
  private readonly _breadcrumbs = [{title: "Groups"}];
  private readonly _groupTableColumns: any[];
  private _groupsSubscription: PromiseSubscription | null;

  constructor(props: InjectedProps) {
    super(props);

    this._groupTableColumns = [{
      title: 'Id',
      dataIndex: 'id',
      sorter: (a: DomainUserGroupSummary, b: DomainUserGroupSummary) => (a.id as string).localeCompare(b.id),
      render: (text: string) => <Link to={toDomainRoute(this.props.domainId,`groups/${text}`)}>{text}</Link>
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
      <CardTitleToolbar title="Groups" icon={<GroupOutlined />}>
        <span className={styles.search}>
          <Input placeholder="Search Groups" addonAfter={<SearchOutlined />} onKeyUp={this._onFilterChange}/>
        </span>
        <Tooltip placement="topRight" title="Create Group" mouseEnterDelay={1}>
          <Button className={styles.iconButton} shape="circle" size="small" htmlType="button"
                  onClick={this._goToCreate}>
            <PlusCircleOutlined />
          </Button>
        </Tooltip>
        <Tooltip placement="topRight" title="Reload Groups" mouseEnterDelay={1}>
          <Button className={styles.iconButton} shape="circle" size="small" htmlType="button"
                  onClick={this._loadGroups}>
            <ReloadOutlined />
          </Button>
        </Tooltip>
      </CardTitleToolbar>
    );
  }

  private _onFilterChange = (event: KeyboardEvent<HTMLInputElement>) => {
    this.setState({groupFilter: (event.target as HTMLInputElement).value}, this._loadGroups);
  }

  private _goToCreate = () => {
    const url = toDomainRoute(this.props.domainId, "create-group");
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
        <Tooltip placement="topRight" title="Edit Group" mouseEnterDelay={1}>
          <Link to={toDomainRoute(this.props.domainId, `groups/${record.id}`)}>
            <Button shape="circle" size="small" htmlType="button" icon={<EditOutlined />}/>
          </Link>
        </Tooltip>
        <Popconfirm title="Are you sure you want to delete this group?"
                    placement="topRight"
                    onConfirm={() => this._onDeleteGroup(record.id)}
                    okText="Yes"
                    cancelText="No"
                    icon={<QuestionCircleOutlined style={{color: 'red'}} />}
        >
        <Tooltip placement="topRight" title="Delete Group" mouseEnterDelay={2}>
          <Button shape="circle" size="small" htmlType="button" icon={<DeleteOutlined />}/>
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
          message: 'Could Not Delete Group',
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
    }).catch(() => {
      this._groupsSubscription = null;
      this.setState({groups: null});
    });
  }
}

const injections = [SERVICES.DOMAIN_GROUP_SERVICE];
export const DomainUserGroups = injectAs<DomainUserGroupsProps>(injections, DomainUserGroupsComponent);
