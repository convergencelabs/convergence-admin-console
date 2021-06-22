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
import {Col, Divider, Row, Table} from "antd";
import {Activity, ActivityParticipant, DomainUser, DomainUserId, DomainUserType} from "@convergence/convergence";
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
  private readonly _sessionTableColumns: any;
  private readonly _stateTableColumns: any;

  constructor(props: ActivityStateProps) {
    super(props);

    this._participantsSubscription = null;

    this.state = {
      participants: [],
      selectedRowKeys: [],
      currentState: null
    }

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

    this._stateTableColumns = [{
      title: 'Key',
      dataIndex: 'key',
      sorter: (a: string, b: string) => a.localeCompare(b),
    }, {
      title: 'Value',
      dataIndex: 'value',
    }];
  }

  public componentDidMount(): void {
    if (this.props.activity) {
    }
  }

  public componentDidUpdate(prevProps: Readonly<ActivityStateProps>) {
    if (prevProps.activity !== this.props.activity) {
      if (this._participantsSubscription !== null) {
        this._participantsSubscription.unsubscribe();
      }

      if (this.props.activity) {
        this._subscribe(this.props.activity);
      }
    }
  }

  private _subscribe(activity: Activity): void {
    this._participantsSubscription = activity
        .participantsAsObservable()
        .subscribe(participants => this.setState({participants}));
  }

  public componentWillUnmount(): void {
    if (this._participantsSubscription) {
      this._participantsSubscription.unsubscribe();
      this._participantsSubscription = null;
    }
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
        <Divider>Participants</Divider>
        <Table size="middle"
               columns={this._sessionTableColumns}
               dataSource={this.state.participants}
               rowKey="sessionId"
               pagination={false}
               rowSelection={rowSelection}
        />
      </Col>
      <Col xs={24} sm={24} md={16} lg={16} xl={16}>
        <Divider>Selected Participant State</Divider>
        <Table size="middle"
               columns={this._stateTableColumns}
               dataSource={participantState}
               rowKey="key"
               pagination={false}
        />
      </Col>
    </Row>
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

  private _renderUsername = (userId: DomainUserId) => {
    if (userId.userType === DomainUserType.ANONYMOUS) {
      return `${userId.username} (Anonymous)`;
    } else if (userId.userType === DomainUserType.CONVERGENCE) {
      return `${userId.username} (Convergence)`;
    } else {
      return userId.username;
    }
  };
}
