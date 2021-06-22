/*
 * Copyright (c) 2021 - Convergence Labs, Inc.
 *
 * This file is part of the Convergence Server, which is released under
 * the terms of the GNU General Public License version 3 (GPLv3). A copy
 * of the GPLv3 should have been provided along with this file, typically
 * located in the "LICENSE" file, which is part of this source code package.
 * Alternatively, see <https://www.gnu.org/licenses/gpl-3.0.html> for the
 * full text of the GPLv3 license, if it was not provided.
 */

import React, {ReactNode} from 'react';
import {Card, Col, Row, Table} from "antd";
import {
  Activity,
  ActivityParticipant,
  ActivityStateClearedEvent,
  ActivityStateRemovedEvent,
  ActivityStateSetEvent,
  DomainUser,
  DomainUserType
} from "@convergence/convergence";
import {Subscription} from "rxjs";

export interface ActivityStateProps {
  activity: Activity | null;
}

export interface ActivityStateState {
  participants: ActivityParticipant[];
  selectedRowKeys: any[];
  currentState: Map<string, any> | null;
}


export class ActivityStateTab extends React.Component<ActivityStateProps, ActivityStateState> {
  private _participantsSubscription: Subscription | null;
  private _eventsSubscription: Subscription | null;
  private readonly _sessionTableColumns: any;
  private readonly _stateTableColumns: any;

  constructor(props: ActivityStateProps) {
    super(props);

    this._participantsSubscription = null;
    this._eventsSubscription = null;

    this.state = {
      participants: [],
      selectedRowKeys: [],
      currentState: null
    }

    this._sessionTableColumns = [{
      title: 'User',
      dataIndex: 'user',
      sorter: (a: DomainUser, b: DomainUser) => a.username.localeCompare(b.username),
      render: (user: DomainUser) => this._renderUsername(user)
    }, {
      title: 'Session Id',
      dataIndex: 'sessionId',
      sorter: (a: string, b: string) => a.localeCompare(b)
    }];

    this._stateTableColumns = [{
      title: 'Key',
      dataIndex: 'key',
    }, {
      title: 'Value',
      dataIndex: 'value',
      render: (val: any) => JSON.stringify(val)
    }];
  }

  public componentDidMount(): void {
    if (this.props.activity) {
      this._subscribe(this.props.activity);
    }
  }

  public componentDidUpdate(prevProps: Readonly<ActivityStateProps>) {
    if (prevProps.activity !== this.props.activity) {
      this._unsubscribe();

      if (this.props.activity) {
        this._subscribe(this.props.activity);
      }
    }
  }

  public componentWillUnmount(): void {
   this._unsubscribe();
  }

  public render(): ReactNode {
    const participantState = Array
        .from(this.state.currentState?.entries() || [])
        .map(e => {
          return {key: e[0], value: e[1]};
        });

    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this._selectionChanged,
      type: "radio" as "radio"
    };

    return <Row gutter={16}>
      <Col xs={24} sm={24} md={8} lg={8} xl={8}>
        <Card type="inner" title="Participants">
          <Table size="middle"
                 columns={this._sessionTableColumns}
                 dataSource={this.state.participants}
                 rowKey="sessionId"
                 pagination={false}
                 rowSelection={rowSelection}
          />
        </Card>
      </Col>
      <Col xs={24} sm={24} md={16} lg={16} xl={16}>
        <Card type="inner" title="Selected Participant State">
          <Table size="middle"
                 columns={this._stateTableColumns}
                 dataSource={participantState}
                 rowKey="key"
                 pagination={false}
          />
        </Card>
      </Col>
    </Row>
  }

  private _subscribe(activity: Activity): void {
    this._participantsSubscription = activity
        .participantsAsObservable()
        .subscribe(participants => this.setState({participants}));

    this._eventsSubscription = activity
        .events()
        .subscribe(e => {
          if (e instanceof ActivityStateSetEvent || e instanceof ActivityStateRemovedEvent || e instanceof ActivityStateClearedEvent) {
            if (this.state.selectedRowKeys.length === 1) {
              const selectedSession = this.state.selectedRowKeys[0];
              if (selectedSession === e.sessionId) {
                const participant = e.activity.participant(selectedSession);
                this.setState({currentState: participant.state});
              }
            }
          }
        });
  }
  private _unsubscribe(): void {
    if (this._participantsSubscription) {
      this._participantsSubscription.unsubscribe();
      this._participantsSubscription = null;
    }

    if (this._eventsSubscription) {
      this._eventsSubscription.unsubscribe();
      this._participantsSubscription = null;
    }
  }

  private _selectionChanged = (selectedRowKeys: any[]) => {
    this.setState({selectedRowKeys});
    if (selectedRowKeys.length > 0) {
      const state = this.props.activity?.participant(selectedRowKeys[0]).state
      this.setState({currentState: state || null});
    } else {
      this.setState({currentState: null});
    }
  }

  private _renderUsername = (user: DomainUser) => {
    const userId = user.userId;

    if (userId.userType === DomainUserType.ANONYMOUS) {
      return `${user.displayName || user.username} (Anonymous)`;
    } else if (userId.userType === DomainUserType.CONVERGENCE) {
      return `${userId.username} (Convergence)`;
    } else {
      return userId.username;
    }
  };
}
