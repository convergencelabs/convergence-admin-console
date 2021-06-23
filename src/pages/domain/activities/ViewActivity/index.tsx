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

import {Card, Col, Row, Tabs} from "antd";
import {RouteComponentProps} from "react-router";
import {makeCancelable, PromiseSubscription} from "../../../../utils/make-cancelable";
import {injectObserver} from "../../../../utils/mobx-utils";
import {DomainId} from "../../../../models/DomainId";
import {DomainActivityService} from "../../../../services/domain/DomainActivityService";
import {IBreadcrumbSegment} from "../../../../stores/BreacrumsStore";
import {toDomainRoute} from "../../../../utils/domain-url";
import {Activity, ActivityParticipant, ActivityPermission, DomainUserIdMap} from "@convergence/convergence";
import {ActiveDomainStore} from "../../../../stores/ActiveDomainStore";
import {STORES} from "../../../../stores/StoreConstants";
import {InfoTable, InfoTableRow} from "../../../../components/server/InfoTable";
import {BlockOutlined} from "@ant-design/icons";
import {Subscription} from "rxjs";
import {shortDateTime, yesNo} from "../../../../utils/format-utils";
import {DescriptionBox} from "../../../../components/common/DescriptionBox";
import {ActivityPermissionsControl} from "../../../../components/domain/activity/ActivityPermissionsControl";
import {ActivityUserPermissionsTab} from "../../../../components/domain/activity/ActivityUserPermissionsTab";
import {ActivityUserPermissions} from "../../../../models/domain/activity/ActivityUserPermissions";
import {ActivityGroupPermissionsTab} from "../../../../components/domain/activity/ActivityGroupPermissionsTab";
import {ActivityGroupPermissions} from "../../../../models/domain/activity/ActivityGroupPermissions";
import {ActivityPermissions} from "../../../../models/domain/activity/ActivityPermissions";
import {SERVICES} from "../../../../services/ServiceConstants";
import {SetPermissions} from "../../../../models/domain/permissions/SetPermissions";
import {ActivityInfo} from "../../../../models/domain/activity/ActivityInfo";
import {ActivityStateTab} from "../../../../components/domain/activity/ActivityStateTab";

import styles from "./styles.module.css";

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
  activityInfo: ActivityInfo | null;
  participants: ActivityParticipant[];
  worldPermissions: ActivityPermissions;
  userPermissions: ActivityUserPermissions[];
  groupPermissions: ActivityGroupPermissions[];
}

class ViewActivityComponent extends React.Component<InjectedProps, ViewActivityState> {
  private readonly _breadcrumbs: IBreadcrumbSegment[] = [
    {title: "Activities", link: toDomainRoute(this.props.domainId, "activities/")},
    {title: decodeURIComponent(this.props.match.params.type)},
    {title: decodeURIComponent(this.props.match.params.id)},
  ];

  private _activitySubscription: PromiseSubscription | null;
  private _participantsSubscription: Subscription | null;

  constructor(props: InjectedProps) {
    super(props);

    this._activitySubscription = null;
    this._participantsSubscription = null;

    this.state = {
      activity: null,
      activityInfo: null,
      participants: [],
      worldPermissions: ActivityPermissions.NONE,
      userPermissions: [],
      groupPermissions: []
    };
  }

  public componentDidMount(): void {
    this._joinActivity();
    this._loadPermissions();
    this._loadActivity();
  }

  public componentDidUpdate(prevProps: Readonly<InjectedProps>) {
    if (this.state.activity === null && this.props.activeDomainStore.domain) {
      this._joinActivity();
    }
  }

  public componentWillUnmount(): void {
    if (this.state.activity && this.state.activity.isJoined()) {
      this.state.activity.leave().catch(e => console.error(e));
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
    // This has to be done this way, since we need to dereference the domain
    // property in order to react to the domain being set.
    const stateTab = this.props.activeDomainStore.domain && this.state.activity  ? <ActivityStateTab activity={this.state.activity}/> : null;
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
                <Tabs className={styles.tabs}>
                  <Tabs.TabPane key="state" tab="Active Participants">
                    <DescriptionBox>
                      If users are currently joined to this activity they will be shown here. You can view the
                      current state of each participant.
                    </DescriptionBox>
                    {stateTab}
                  </Tabs.TabPane>
                  <Tabs.TabPane key="world-permissions" tab="World Permissions">
                    <DescriptionBox>
                      These permissions apply to all users in the system that do not
                      have specific permissions set for them or a group they belong
                      to.
                    </DescriptionBox>
                    <ActivityPermissionsControl value={this.state.worldPermissions}
                                                onChange={this._worldPermissionsChanged}/>
                  </Tabs.TabPane>
                  <Tabs.TabPane key="user-permissions" tab="User Permissions">
                    <DescriptionBox>
                      These permissions apply specific users in the system.
                    </DescriptionBox>
                    <ActivityUserPermissionsTab domainId={this.props.domainId}
                                                onUserPermissionsChanged={this._userPermissionsChanged}
                                                permissions={this.state.userPermissions}/>
                  </Tabs.TabPane>
                  <Tabs.TabPane key="group-permissions" tab="Group Permissions">
                    <DescriptionBox>
                      These permissions apply any user that is a member of the group defined below.
                    </DescriptionBox>
                    <ActivityGroupPermissionsTab domainId={this.props.domainId}
                                                 onGroupPermissionsChanged={this._groupPermissionsChanged}
                                                 permissions={this.state.groupPermissions}
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
    if (this.state.activityInfo) {
      return (
          <InfoTable>
            <InfoTableRow label="Id">{this.state.activityInfo.activityId}</InfoTableRow>
            <InfoTableRow label="Type">{this.state.activityInfo.activityType}</InfoTableRow>
            <InfoTableRow label="Ephemeral">{yesNo(this.state.activityInfo.ephemeral)}</InfoTableRow>
            <InfoTableRow label="Created At">{shortDateTime(this.state.activityInfo.created)}</InfoTableRow>
            <InfoTableRow label="Current Participants">{this.state.participants.length}</InfoTableRow>
          </InfoTable>
      )
    } else {
      return null;
    }
  }

  private _joinActivity = () => {
    const {domain} = this.props.activeDomainStore;
    const {type, id} = this.props.match.params;

    if (domain && !domain.activities().isJoined(type, id)) {
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
  }

  private _loadPermissions(): void {
    const {type, id} = this.props.match.params;
    this.props.domainActivityService.getActivityPermissions(this.props.domainId, type, id).then(permissions => {
      const worldPermissions = ActivityPermissions.of(permissions.worldPermissions as Set<ActivityPermission>);
      const groupPermissions = Array.from(permissions.groupPermissions.entries())
          .map(e => new ActivityGroupPermissions(e[0], ActivityPermissions.of(e[1] as Set<ActivityPermission>)));
      const userPermissions = permissions.userPermissions.entries()
          .map(e => new ActivityUserPermissions(e[0], ActivityPermissions.of(e[1] as Set<ActivityPermission>)));
      this.setState({worldPermissions, userPermissions, groupPermissions});
    }).catch(e => console.error(e));
  }

  private _loadActivity(): void {
    const {type, id} = this.props.match.params;
    this.props.domainActivityService.getActivity(this.props.domainId, type, id).then(activityInfo => {
      this.setState({activityInfo});
    }).catch(e => console.error(e));
  }

  private _worldPermissionsChanged = (worldPermissions: ActivityPermissions) => {
    const permissions = {worldPermissions: worldPermissions.toPermissions()};
    this._setAndReloadPermissions(permissions);
  };

  private _userPermissionsChanged = (userPermissions: ActivityUserPermissions[], updated: ActivityUserPermissions) => {
    this.setState({userPermissions});
    const up = new DomainUserIdMap<Set<ActivityPermission>>();
    up.set(updated.userId, updated.permissions.toPermissions());
    const permissions = {userPermissions: up};
    this._setAndReloadPermissions(permissions);
  };

  private _groupPermissionsChanged = (groupPermissions: ActivityGroupPermissions[], updated: ActivityGroupPermissions) => {
    this.setState({groupPermissions});
    const gp = new Map<string, Set<ActivityPermission>>();
    gp.set(updated.groupId, updated.permissions.toPermissions());
    const permissions = {groupPermissions: gp};
    this._setAndReloadPermissions(permissions);
  };

  private _setAndReloadPermissions(setPermissions: SetPermissions): void {
    const {type, id} = this.props.match.params;
    this.props.domainActivityService
        .setActivityPermissions(this.props.domainId, type, id, setPermissions)
        .then(() => {
          this._loadPermissions();
        });
  }
}

const injections = [STORES.ACTIVE_DOMAIN_STORE, SERVICES.DOMAIN_ACTIVITY_SERVICE];
export const ViewActivity = injectObserver<ViewActivityProps>(injections, ViewActivityComponent);

