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
  BlockOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusCircleOutlined,
  QuestionCircleOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {Button, Card, Input, notification, Popconfirm, Table, TablePaginationConfig} from "antd";
import {CardTitleToolbar} from "../../../../components/common/CardTitleToolbar/";
import {RouteComponentProps} from "react-router";
import {makeCancelable, PromiseSubscription} from "../../../../utils/make-cancelable";
import {injectAs} from "../../../../utils/mobx-utils";
import {SERVICES} from "../../../../services/ServiceConstants";
import {Link} from "react-router-dom";
import {DomainId} from "../../../../models/DomainId";
import {ToolbarButton} from "../../../../components/common/ToolbarButton";
import {toDomainRoute} from "../../../../utils/domain-url";
import styles from "./styles.module.css";
import {PagedData} from "../../../../models/PagedData";
import queryString from "query-string";
import {appendToQueryParamString} from "../../../../utils/router-utils";
import {DomainActivityService} from "../../../../services/domain/DomainActivityService";
import {ActivityInfo} from "../../../../models/domain/activity/ActivityInfo";
import {shortDateTime, yesNo} from "../../../../utils/format-utils";

export interface IActivitySearchParams {
  type?: string;
  id?: string;
  pageSize: number;
  page: number;
}

export interface DomainActivitiesProps extends RouteComponentProps {
  domainId: DomainId;
}

interface InjectedProps extends DomainActivitiesProps {
  domainActivityService: DomainActivityService;
}

export interface DomainActivitiesState {
  activities: PagedData<ActivityInfo>;
  searchParams: IActivitySearchParams;
}

class DomainActivitiesComponent extends React.Component<InjectedProps, DomainActivitiesState> {
  private readonly _breadcrumbs = [{title: "Activities"}];
  private readonly _activityTableColumns: any[];

  private _activitiesSubscription: PromiseSubscription | null;

  constructor(props: InjectedProps) {
    super(props);
    this._activityTableColumns = [{
      title: 'Id',
      dataIndex: 'activityId',
      sorter: (a: ActivityInfo, b: ActivityInfo) => a.activityId.localeCompare(b.activityId),
      render: (text: string, record: ActivityInfo) =>
        <Link
          to={toDomainRoute(this.props.domainId, `activities/${encodeURIComponent(record.activityType)}/${encodeURIComponent(record.activityId)}`)}>{text}</Link>
    }, {
      title: 'Type',
      dataIndex: 'activityType',
      sorter: (a: ActivityInfo, b: ActivityInfo) => a.activityType.localeCompare(b.activityType)
    }, {
      title: 'Ephemeral',
      dataIndex: 'ephemeral',
      render: (ephemeral: boolean) => yesNo(ephemeral)
    }, {
      title: 'Created',
      dataIndex: 'created',
      render: (created: Date) => shortDateTime(created)
    }, {
      title: '',
      align: 'right',
      width: 110,
      render: this._renderActions
    }];

    this._activitiesSubscription = null;

    const searchParams = DomainActivitiesComponent._parseQueryInput(this.props.location.search);

    this.state = {
      activities: PagedData.EMTPY,
      searchParams
    };
  }

  public componentDidMount(): void {
    this._loadActivities();
  }

  public componentWillUnmount(): void {
    if (this._activitiesSubscription) {
      this._activitiesSubscription.unsubscribe();
      this._activitiesSubscription = null;
    }
  }

  public componentDidUpdate(prevProps: InjectedProps, prevState: DomainActivitiesState): void {
    // First see if the route has changes, If so we set the current state.
    // then later we see if that changed our actual params we care about.
    if (prevProps.location.search !== this.props.location.search) {
      const searchParams = DomainActivitiesComponent._parseQueryInput(this.props.location.search);
      this.setState({
        searchParams
      });
    } else if (prevState.searchParams.id !== this.state.searchParams.id ||
      prevState.searchParams.type !== this.state.searchParams.type ||
      prevState.searchParams.pageSize !== this.state.searchParams.pageSize ||
      prevState.searchParams.page !== this.state.searchParams.page) {
      this._loadActivities();
    }
  }

  public render(): ReactNode {
    const pagination: TablePaginationConfig = {
      pageSize: this.state.searchParams.pageSize,
      current: this.state.searchParams.page,
      total: this.state.activities.totalResults,
      onChange: this._pageChange,
      showTotal: (total: number) => `${total} total results`
    };

    return (
      <Page breadcrumbs={this._breadcrumbs}>
        <Card title={this._renderToolbar()}>
          <Table className={styles.userTable}
                 size="middle"
                 rowKey={act => `${act.activityType}/${act.activityId}`}
                 columns={this._activityTableColumns}
                 dataSource={this.state.activities.data}
                 pagination={pagination}
          />
        </Card>
      </Page>
    );
  }

  private _renderToolbar(): ReactNode {
    return (
      <CardTitleToolbar title="Activities" icon={<BlockOutlined/>}>
        <span className={styles.search}>
          <Input placeholder="Search by Id" addonAfter={<SearchOutlined/>} onKeyUp={this._onFilterChange}/>
        </span>
        <ToolbarButton icon={<PlusCircleOutlined/>} tooltip="Create Activity" onClick={this._goToCreate}/>
        <ToolbarButton icon={<ReloadOutlined/>} tooltip="Reload Activities" onClick={this._loadActivities}/>
      </CardTitleToolbar>
    );
  }

  private _goToCreate = () => {
    const url = toDomainRoute(this.props.domainId, "create-activity");
    this.props.history.push(url);
  }

  private _renderActions = (_: undefined, record: ActivityInfo) => {
    return (
      <span className={styles.actions}>
        <Tooltip placement="topRight" title="View Activity" mouseEnterDelay={1}>
          <Link
            to={toDomainRoute(this.props.domainId, `activities/${encodeURIComponent(record.activityType)}/${encodeURIComponent(record.activityId)}`)}>
            <Button shape="circle" size="small" htmlType="button" icon={<EyeOutlined/>}/>
          </Link>
        </Tooltip>
        <Popconfirm title="Are you sure you want to delete this activity?"
                    placement="topRight"
                    onConfirm={() => this._onDeleteActivity(record.activityType, record.activityId)}
                    okText="Yes"
                    cancelText="No"
                    icon={<QuestionCircleOutlined style={{color: 'red'}}/>}
        >
        <Tooltip placement="topRight" title="Delete Activity" mouseEnterDelay={2}>
          <Button shape="circle" size="small" htmlType="button"><DeleteOutlined/></Button>
        </Tooltip>
      </Popconfirm>
    </span>
    );
  }

  private _onDeleteActivity = (activityType: string, activityId: string) => {
    this.props.domainActivityService.deleteActivity(this.props.domainId, activityType, activityId)
      .then(() => {
        this._loadActivities();
        notification.success({
          message: 'Activity Deleted',
          description: `The activity '${activityId}' was deleted.`,
        });
      })
      .catch(() => {
        notification.error({
          message: 'Could Not Delete Activity',
          description: `The activity could not be deleted.`,
        });
      });
  }

  private _loadActivities = () => {
    const domainId = this.props.domainId;
    const id = this.state.searchParams.id !== "" ? this.state.searchParams.id : undefined;
    const type = this.state.searchParams.type !== "" ? this.state.searchParams.type : undefined;
    const offset = this.state.searchParams.page === undefined ? 0 : ((this.state.searchParams.page - 1) * this.state.searchParams.pageSize);
    const pageSize = this.state.searchParams.pageSize;
    const {
      promise,
      subscription
    } = makeCancelable(this.props.domainActivityService.getActivities(domainId, type, id, offset, pageSize));
    this._activitiesSubscription = subscription;
    promise.then(activities => {
      this._activitiesSubscription = null;
      this.setState({activities});
    }).catch(err => {
      console.error(err);
      this._activitiesSubscription = null;
      this.setState({activities: PagedData.EMTPY});
    });
  }

  private _pageChange = (page: number, pageSize?: number) => {
    pageSize = pageSize || 25;
    let newUrl = appendToQueryParamString({page, pageSize});
    this.props.history.push(newUrl);
  }

  private _onFilterChange = (event: KeyboardEvent<HTMLInputElement>) => {
    // todo debounce
    const id = (event.target as HTMLInputElement).value;
    const page = 1;
    const pageSize = this.state.searchParams.pageSize;

    let newUrl = appendToQueryParamString({id, page, pageSize});
    this.props.history.push(newUrl);
  }

  private static _parseQueryInput(urlQueryParams: string): IActivitySearchParams {
    let {
      id,
      type,
      pageSize,
      page
    } = queryString.parse(urlQueryParams, {parseNumbers: true});

    return {
      type: type ? type + "" : undefined,
      id: id ? id + "" : undefined,
      pageSize: pageSize as number || 25,
      page: page as number || 1
    };
  }
}

const injections = [SERVICES.DOMAIN_ACTIVITY_SERVICE];
export const DomainActivities = injectAs<DomainActivitiesProps>(injections, DomainActivitiesComponent);

