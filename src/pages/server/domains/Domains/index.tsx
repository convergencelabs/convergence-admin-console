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

import React, {KeyboardEvent, ReactNode} from 'react';
import {Page} from "../../../../components";

import {
  DatabaseOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  QuestionCircleOutlined,
  ReloadOutlined,
  SearchOutlined, StarFilled, StarOutlined,
} from '@ant-design/icons';

import { Button, Card, Input, notification, Popconfirm, Table } from "antd";
import styles from "./styles.module.css";
import {injectAs} from "../../../../utils/mobx-utils";
import {SERVICES} from "../../../../services/ServiceConstants";
import {DomainService} from "../../../../services/DomainService";
import {makeCancelable, PromiseSubscription} from "../../../../utils/make-cancelable";
import {DomainDescriptor} from "../../../../models/DomainDescriptor";
import {RouteComponentProps} from "react-router";
import {CardTitleToolbar} from "../../../../components/common/CardTitleToolbar/";
import Tooltip from "antd/es/tooltip";
import {NamespaceAutoComplete} from "../../../../components/server/NamespaceAutoComplete";
import {LoggedInUserService} from "../../../../services/LoggedInUserService";
import {DomainId} from "../../../../models/DomainId";
import {formatDomainAvailability, formatDomainStatus} from "../../../../utils/format-utils";
import {DomainStatusIcon} from "../../../../components/common/DomainStatusIcon";
import {DomainStatus} from "../../../../models/DomainStatus";
import {DisableableLink} from "../../../../components/common/DisableableLink";
import {STORES} from "../../../../stores/StoreConstants";
import {ConfigStore} from "../../../../stores/ConfigStore";
import {IBreadcrumbSegment} from "../../../../stores/BreacrumsStore";
import {toDomainRoute} from "../../../../utils/domain-url";
import {DomainAvailabilityIcon} from "../../../../components/common/DomainAvailabilityIcon";
import {DomainAvailability} from "../../../../models/DomainAvailability";

interface InjectedProps extends RouteComponentProps {
  domainService: DomainService;
  loggedInUserService: LoggedInUserService;
  configStore: ConfigStore;
}

export interface DomainsState {
  domains: DomainDescriptor[] | null;
  favorites: DomainId[];
  domainsFilter: string;
  namespace: string;
}

export class DomainsComponent extends React.Component<InjectedProps, DomainsState> {
  private readonly _breadcrumbs: IBreadcrumbSegment[] = ([{title: "Domains"}]);
  private readonly _domainTableColumns: any[];
  private _domainSubscription: PromiseSubscription | null;
  private _favoritesSubscription: PromiseSubscription | null;
  private _reloadInterval: any = null;

  constructor(props: InjectedProps) {
    super(props);

    this._domainTableColumns = [{
      title: 'Display Name',
      dataIndex: 'displayName',
      sorter: (a: DomainDescriptor, b: DomainDescriptor) => a.displayName.localeCompare(b.displayName),
      render: (displayName: string, domain: DomainDescriptor) => {
        const disabled = domain.status === DomainStatus.INITIALIZING || domain.status === DomainStatus.DELETING;
        return <DisableableLink to={toDomainRoute(domain.domainId, "")}
                                disabled={disabled}>{displayName}</DisableableLink>
      }
    }, {
      title: 'Namespace',
      dataIndex: 'domainId',
      sorter: (a: DomainDescriptor, b: DomainDescriptor) =>
          a.domainId.namespace.localeCompare(b.domainId.namespace),
      render: (domainId: DomainId) => domainId.namespace
    }, {
      title: 'Id',
      dataIndex: 'domainId',
      sorter: (a: DomainDescriptor, b: DomainDescriptor) =>
          a.domainId.id.localeCompare(b.domainId.id),
      render: (domainId: DomainId) => domainId.id
    }, {
      title: 'Availability',
      dataIndex: 'availability',
      align: 'left',
      render: (availability: DomainAvailability) => (
          <span>
          <DomainAvailabilityIcon availability={availability}/>
          <span style={{marginLeft: 10}}>{formatDomainAvailability(availability)}</span>
        </span>
      )
    }, {
      title: 'Status',
      dataIndex: 'status',
      align: 'left',
      render: (status: DomainStatus) => (
        <span>
          <DomainStatusIcon status={status}/>
          <span style={{marginLeft: 10}}>{formatDomainStatus(status)}</span>
        </span>
      )
    }, {
      title: 'Actions',
      dataIndex: '',
      width: '100px',
      align: 'right',
      render: this._renderActions
    }];

    this._domainSubscription = null;
    this._favoritesSubscription = null;

    this.state = {
      domains: null,
      favorites: [],
      domainsFilter: "",
      namespace: ""
    };

    this._loadDomains();
  }

  public componentWillUnmount(): void {
    if (this._domainSubscription !== null) {
      this._domainSubscription.unsubscribe();
      this._domainSubscription = null;
    }

    if (this._favoritesSubscription !== null) {
      this._favoritesSubscription.unsubscribe();
      this._favoritesSubscription = null;
    }

    if (this._reloadInterval !== null) {
      clearTimeout(this._reloadInterval);
      this._reloadInterval = null;
    }
  }

  public render(): ReactNode {
    return (
      <Page breadcrumbs={this._breadcrumbs}>
        <Card title={this._renderToolbar()}>
          <Table className={styles.userTable}
                 size="middle"
                 rowKey={record => record.domainId.namespace + "/" + record.domainId.id}
                 columns={this._domainTableColumns}
                 dataSource={this.state.domains || []}
          />
        </Card>
      </Page>
    );
  }

  private _renderToolbar(): ReactNode {
    return (
      <CardTitleToolbar title="Domains" icon={<DatabaseOutlined />}>
        {this.props.configStore.namespacesEnabled ?
          <NamespaceAutoComplete placeholder={"Filter Namespace"} onChange={this._onNamespaceChange}/> : null
        }
        <span className={styles.search}>
          <Input placeholder="Search Domains" addonAfter={<SearchOutlined />} onKeyUp={this._onFilterChange}/>
        </span>
        <Tooltip placement="topRight" title="Create Domain" mouseEnterDelay={1}>
          <Button className={styles.iconButton} shape="circle" size="small" htmlType="button"
                  onClick={this._goToCreate}>
            <PlusCircleOutlined />
          </Button>
        </Tooltip>
        <Tooltip placement="topRight" title="Reload Domains" mouseEnterDelay={1}>
          <Button className={styles.iconButton} shape="circle" size="small" htmlType="button"
                  onClick={this._loadDomains}>
            <ReloadOutlined />
          </Button>
        </Tooltip>
      </CardTitleToolbar>
    );
  }

  private _renderActions = (text: any, record: DomainDescriptor) => {
    const fav = this._isFav(record);
    const favType = fav ? undefined : "dashed";
    const color = fav ? "#e3b12e" : "darkgray";

    const deleteDisabled = false;
    const deleteButton = <Button className={styles.iconButton}
                                 shape="circle"
                                 size="small"
                                 htmlType="button"
                                 disabled={deleteDisabled}><DeleteOutlined /></Button>;

    const deleteComponent = deleteDisabled ?
      <Tooltip placement="topRight" title="You do not have permissions to delete this domain!" mouseEnterDelay={1}>
        {deleteButton}
      </Tooltip> :
      <Popconfirm title={`Delete domain '${record.domainId.namespace}/${record.domainId.id}'?`}
                  placement="topRight"
                  onConfirm={() => this._onDeleteDomain(record.domainId.namespace, record.domainId.id)}
                  okText="Yes"
                  cancelText="No"
                  icon={<QuestionCircleOutlined style={{color: 'red'}} />}
      >
        <Tooltip placement="topRight" title="Delete Domain" mouseEnterDelay={2}>
          {deleteButton}
        </Tooltip>
      </Popconfirm>

    return (
      <span className={styles.actions}>
        <Button className={styles.iconButton}
                shape="circle"
                size="small"
                htmlType="button"
                type={favType}
                onClick={() => this._onFavClick(record)}
        >
          {fav ? <StarFilled style={{color}}/> : <StarOutlined style={{color}} />}
        </Button>
        {deleteComponent}
      </span>
    );
  }

  private _isFav(domain: DomainDescriptor): boolean {
    return this.state.favorites.find(fav => fav.equals(domain.domainId)) !== undefined;
  }

  private _onFavClick(domain: DomainDescriptor): void {
    const fav = this._isFav(domain);
    const promise = fav ?
      this.props.loggedInUserService.removeFavoriteDomain(domain.domainId) :
      this.props.loggedInUserService.addFavoriteDomain(domain.domainId);

    promise
      .then(() => this.props.loggedInUserService.getFavoriteDomains())
      .then(favs => {
        const favorites = favs.map(f => f.domainId)
        this.setState({favorites});
      });
  }

  private _onNamespaceChange = (namespace: string) => {
    this.setState({namespace}, this._loadDomains);
  }

  private _goToCreate = () => {
    this.props.history.push("/create-domain");
  }

  private _onFilterChange = (event: KeyboardEvent<HTMLInputElement>) => {
    this.setState({domainsFilter: (event.target as HTMLInputElement).value}, this._loadDomains);
  }

  private _onDeleteDomain = (namespace: string, id: string) => {
    this.props.domainService.deleteDomain(new DomainId(namespace, id))
      .then(() => {
        this._loadDomains();
        notification.success({
          message: 'Success',
          description: `Domain '${namespace}/${id}' is marked for deletion.`,
        });
      })
      .catch(err => {
        console.error(err);
        notification.error({
          message: 'Could Not Delete Domain',
          description: `The domain could not be deleted.`,
        });
      });
  }

  private _loadDomains = () => {
    if (this._domainSubscription !== null) {
      this._domainSubscription.unsubscribe();
    }

    if (this._favoritesSubscription !== null) {
      this._favoritesSubscription.unsubscribe();
    }

    const domainsFilter = this.state.domainsFilter !== "" ? this.state.domainsFilter : undefined;
    const namespace = this.state.namespace !== null ? this.state.namespace : undefined;
    const {promise, subscription} =
      makeCancelable(this.props.domainService.getDomains(namespace, domainsFilter, 0, 10));
    this._domainSubscription = subscription;

    const cp = makeCancelable(this.props.loggedInUserService.getFavoriteDomains());

    this._favoritesSubscription = cp.subscription;

    Promise.all([promise, cp.promise]).then(([domains, favs]) => {
      this._domainSubscription = null;
      const favorites = favs.map(f => f.domainId);
      this.setState({domains, favorites});
      if (this._reloadInterval !== null) {
        clearTimeout(this._reloadInterval);
        this._reloadInterval = null;
      }

      if (domains.find(d => d.status === DomainStatus.INITIALIZING || d.status === DomainStatus.DELETING)) {
        this._reloadInterval = setInterval(this._loadDomains, 5000);
      }
    }).catch(err => {
      console.error(err);
      this._domainSubscription = null;
      this._favoritesSubscription = null
      this.setState({domains: null});
    });
  }
}

const injections = [SERVICES.DOMAIN_SERVICE, SERVICES.LOGGED_IN_USER_SERVICE, STORES.CONFIG_STORE];
export const Domains = injectAs<RouteComponentProps>(injections, DomainsComponent);
