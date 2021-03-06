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
import Tooltip from "antd/es/tooltip";
import {DeleteOutlined, QuestionCircleOutlined} from '@ant-design/icons';
import {Button, notification, Popconfirm, Table} from "antd";
import styles from "./styles.module.css";
import {makeCancelable, PromiseSubscription} from "../../../../utils/make-cancelable";
import {injectAs} from "../../../../utils/mobx-utils";
import {SERVICES} from "../../../../services/ServiceConstants";
import {DomainId} from "../../../../models/DomainId";
import {DomainMemberService} from "../../../../services/domain/DomainMemberService";
import {DomainMember} from "../../../../models/domain/DomainMember";
import {AddDomainMemberControl} from "../../../../components/domain/settings/AddDomainMemberControl";
import {loggedInUserStore} from "../../../../stores/LoggedInUserStore";
import {DomainSettingSection} from "../SettingsSection";

export interface DomainMemberSettingsProps {
  domainId: DomainId;
}

interface InjectedProps extends DomainMemberSettingsProps {
  domainMemberService: DomainMemberService;
}

export interface DomainMemberSettingsState {
  members: DomainMember[] | null;
  memberFilter: string;
}

class DomainMemberSettingsComponent extends React.Component<InjectedProps, DomainMemberSettingsState> {
  private readonly _memberTableColumns: any[];
  private _membersSubscription: PromiseSubscription | null;

  constructor(props: InjectedProps) {
    super(props);

    this._memberTableColumns = [{
      title: 'Username',
      dataIndex: 'username',
      sorter: (a: DomainMember, b: DomainMember) => a.username.localeCompare(b.username)
    }, {
      title: 'Role',
      dataIndex: 'role',
      sorter: (a: DomainMember, b: DomainMember) => a.role.localeCompare(b.role)
    }, {
      title: '',
      align: 'right',
      width: 50,
      render: this._renderActions
    }];

    this._membersSubscription = null;

    this.state = {
      members: null,
      memberFilter: ""
    };

    this._loadMembers();
  }

  public componentWillUnmount(): void {
    if (this._membersSubscription) {
      this._membersSubscription.unsubscribe();
      this._membersSubscription = null;
    }
  }

  public render(): ReactNode {
    return (
        <DomainSettingSection>
          <AddDomainMemberControl
              domainId={this.props.domainId}
              onAdd={this._onAdd}
              user={loggedInUserStore.loggedInUser?.username!}
          />
          <Table className={styles.memberTable}
                 size="middle"
                 rowKey="username"
                 columns={this._memberTableColumns}
                 dataSource={this.state.members || []}
          />
        </DomainSettingSection>
    );
  }

  private _renderActions = (_: undefined, record: DomainMember) => {
    const disabled = record.username === loggedInUserStore.loggedInUser?.username;

    return (
        <span className={styles.actions}>
        <Popconfirm title="Are you sure you want to remove this member?"
                    placement="topRight"
                    onConfirm={() => this._onDeleteMember(record.username)}
                    okText="Yes"
                    cancelText="No"
                    disabled={disabled}
                    icon={<QuestionCircleOutlined style={{color: 'red'}}/>}
        >
        <Tooltip placement="topRight" title="Remove Member" mouseEnterDelay={2}>
          <Button shape="circle" size="small" htmlType="button" icon={<DeleteOutlined/>} disabled={disabled}/>
        </Tooltip>
      </Popconfirm>
    </span>
    );
  }

  private _onAdd = (member: DomainMember) => {
    return this.props.domainMemberService
        .setDomainMemberRole(
            this.props.domainId,
            member.username,
            member.role
        )
        .then(() => {
          this._loadMembers();
          return Promise.resolve(true);
        })
        .catch((err) => {
          return Promise.resolve(false);
        });
  }

  private _onDeleteMember = (username: string) => {
    this.props.domainMemberService.removeDomainMember(this.props.domainId, username)
        .then(() => {
          this._loadMembers();
          notification.success({
            message: 'Member Removed',
            description: `The member '${username}' was removed from this domain.`,
          });
        })
        .catch(err => {
          console.error(err);
          notification.error({
            message: 'Could Not Remove Member',
            description: `The member could not be removed.`,
          });
        });
  }

  private _loadMembers = () => {
    const {
      promise,
      subscription
    } = makeCancelable(this.props.domainMemberService.getDomainMembers(this.props.domainId));
    this._membersSubscription = subscription;
    promise.then(memberMap => {
      const members: DomainMember[] = [];
      memberMap.forEach((role, username) => members.push(new DomainMember(username, role)));
      this._membersSubscription = null;
      this.setState({members});
    }).catch(err => {
      this._membersSubscription = null;
      this.setState({members: null});
    });
  }
}

const injections = [SERVICES.DOMAIN_MEMBER_SERVICE];
export const DomainMembers = injectAs<DomainMemberSettingsProps>(injections, DomainMemberSettingsComponent);
