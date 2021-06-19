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
import {Page} from "../../../../components";

import {Card, Col, Row, Table, Tabs} from "antd";
import {RouteComponentProps} from "react-router";
import {makeCancelable, PromiseSubscription} from "../../../../utils/make-cancelable";
import {injectAs} from "../../../../utils/mobx-utils";
import {DomainId} from "../../../../models/DomainId";
import {DomainActivityService} from "../../../../services/domain/DomainActivityService";
import {IBreadcrumbSegment} from "../../../../stores/BreacrumsStore";
import {toDomainRoute} from "../../../../utils/domain-url";
import {Activity, ActivityParticipant, DomainUser, DomainUserId, DomainUserType} from "@convergence/convergence";
import {ActiveDomainStore} from "../../../../stores/ActiveDomainStore";
import {STORES} from "../../../../stores/StoreConstants";
import {InfoTable, InfoTableRow} from "../../../../components/server/InfoTable";
import {BlockOutlined} from "@ant-design/icons";
import {Subscription} from "rxjs";
import {shortDateTime, yesNo} from "../../../../utils/format-utils";
import {DescriptionBox} from "../../../../components/common/DescriptionBox";
import {ActivityPermissionsControl} from "../../../../components/domain/activity/ActivityPermissionsControl";
import {ActivityUserPermissionsTab} from "../../../../components/domain/activity/ActivityUserPermissionsTab";
import {ActivityUserPermissions} from "../../../../models/domain/ActivityUserPermissions";
import {ActivityGroupPermissionsTab} from "../../../../components/domain/activity/ActivityGroupPermissionsTab";
import {ActivityGroupPermissions} from "../../../../models/domain/ActivityGroupPermissions";

export interface IActivitySearchParams {
  filter?: string;
  pageSize: number;
  page: number;
}

export interface ViewActivityProps extends RouteComponentProps<{ type: string, id: string }> {
  domainId: DomainId;
}

interface InjectedProps extends ViewActivityProps {
  domainActivityService: DomainActivityService;
  activeDomainStore: ActiveDomainStore;
}

export interface ViewActivityState {
  activity: Activity | null;
  participants: ActivityParticipant[]
}

class ViewActivityEventsComponent extends React.Component<InjectedProps, ViewActivityState> {
  private readonly _breadcrumbs: IBreadcrumbSegment[] = [
    {title: "Activities", link: toDomainRoute(this.props.domainId, "activities/")},
    {title: decodeURIComponent(this.props.match.params.type)},
    {title: decodeURIComponent(this.props.match.params.id)},
  ];

  private _activitySubscription: PromiseSubscription | null;
  private _participantsSubscription: Subscription | null;
  private readonly _sessionTableColumns: any;

  constructor(props: InjectedProps) {
    super(props);

    this._activitySubscription = null;
    this._participantsSubscription = null;

    this._sessionTableColumns = [{
      title: 'User',
      dataIndex: 'user',
      sorter: (a: DomainUser, b: DomainUser) => a.username.localeCompare(b.username),
      render: (user: DomainUser) => this._renderUsername(user.userId)
    }, {
      title: 'Session Id',
      dataIndex: 'sessionId',
      sorter: (a: string, b: string) => a.localeCompare(b)
    }];

    this.state = {
      activity: null,
      participants: []
    };
  }

  public componentDidMount(): void {
    if (this.props.activeDomainStore.domain) {
      this._joinActivity();
    }
  }

  public componentWillUnmount(): void {
    if (this.state.activity && this.state.activity.isJoined()) {
      this.state.activity.leave();
    }

    if (this._participantsSubscription) {
      this._participantsSubscription.unsubscribe();
      this._participantsSubscription = null;
    }

    if (this._activitySubscription) {
      this._activitySubscription.unsubscribe();
      this._activitySubscription = null;
    }
  }

  public render(): ReactNode {
    return (
      <Page breadcrumbs={this._breadcrumbs}>
        <Card title={<span><BlockOutlined/> Activity</span>}>
          <Row gutter={16}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              {this._renderActivityInfo()}
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Tabs>
                <Tabs.TabPane key="state" tab="Activity State">
                  {this._renderSessionTable()}
                </Tabs.TabPane>
                <Tabs.TabPane key="world-permissions" tab="World Permissions">
                  <DescriptionBox>
                    These permissions apply to all users in the system that do not
                    have specific permissions set for them or a group they belong
                    to.
                  </DescriptionBox>
                  <ActivityPermissionsControl/>
                </Tabs.TabPane>
                <Tabs.TabPane key="user-permissions" tab="User Permissions">
                  <DescriptionBox>
                    These permissions apply specific users in the system.
                  </DescriptionBox>
                  <ActivityUserPermissionsTab domainId={this.props.domainId}
                                              onUserPermissionsChanged={this._userPermissionsChanged}
                                              permissions={[]}/>

                </Tabs.TabPane>
                <Tabs.TabPane key="group-permissions" tab="Group Permissions">
                  <DescriptionBox>
                    These permissions apply any user that is a member of the group defined below.
                  </DescriptionBox>
                  <ActivityGroupPermissionsTab domainId={this.props.domainId}
                                               onGroupPermissionsChanged={this._groupPermissionsChanged}
                                               permissions={[]}
                  />
                </Tabs.TabPane>
              </Tabs>
            </Col>
          </Row>
        </Card>
      </Page>
    );
  }

  private _renderActivityInfo(): ReactNode {
    if (this.state.activity) {
      return (
        <InfoTable>
          <InfoTableRow label="Id">{this.state.activity.id()}</InfoTableRow>
          <InfoTableRow label="Type">{this.state.activity.type()}</InfoTableRow>
          <InfoTableRow label="Ephemeral">{yesNo(this.state.activity.isEphemeral())}</InfoTableRow>
          <InfoTableRow label="Created At">{shortDateTime(this.state.activity.createdTime())}</InfoTableRow>
          <InfoTableRow label="Current Participants">{this.state.participants.length}</InfoTableRow>
        </InfoTable>
      )
    } else {
      return null;
    }
  }

  private _renderSessionTable(): ReactNode {
    if (this.state.activity) {
      return <Table size="middle"
                    columns={this._sessionTableColumns}
                    dataSource={this.state.participants}
                    rowKey="sessionId"
                    pagination={false}
      />
    } else {
      return null;
    }
  }

  private _joinActivity = () => {
    const {type, id} = this.props.match.params;
    const {promise, subscription} = makeCancelable(
      this.props.activeDomainStore.domain!.activities().join(type, id, {lurk: true}));
    this._activitySubscription = subscription;
    promise.then(activity => {
      this._activitySubscription = null;
      this.setState({activity: activity});
      this._participantsSubscription = activity.participantsAsObservable().subscribe(participants => {
        this.setState({participants});
      })
    }).catch(err => {
      console.error(err);
      this._activitySubscription = null;
      this.setState({activity: null});
    });
  }

  private _renderUsername = (userId: DomainUserId) => {
    if (userId.userType === DomainUserType.ANONYMOUS) {
      return `${userId.username} (Anonymous)`;
    } else if (userId.userType === DomainUserType.CONVERGENCE) {
      return `${userId.username} (Convergence)`;
    } else {
      return userId.username;
    }
  };

  private _userPermissionsChanged = (data: ActivityUserPermissions[]) => {

  };

  private _groupPermissionsChanged = (data: ActivityGroupPermissions[]) => {

  };
}

const injections = [STORES.ACTIVE_DOMAIN_STORE];
export const ViewActivity = injectAs<ViewActivityProps>(injections, ViewActivityEventsComponent);

