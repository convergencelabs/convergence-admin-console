/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React, {KeyboardEvent, ReactNode} from 'react';
import {Page} from "../../../../components/common/Page/";
import {Button, Card, Icon, Input, notification, Popconfirm, Table} from "antd";
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
import {formatDomainStatus} from "../../../../utils/format-utils";
import {DomainStatusIcon} from "../../../../components/common/DomainStatusIcon";
import {DomainStatus} from "../../../../models/DomainStatus";
import {DisableableLink} from "../../../../components/common/DisableableLink";
import {STORES} from "../../../../stores/StoreConstants";
import {ConfigStore} from "../../../../stores/ConfigStore";
import {IBreadcrumbSegment} from "../../../../stores/BreacrumsStore";
import {toDomainRoute} from "../../../../utils/domain-url";

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
      sorter: (a: any, b: any) => (a.displayName as string).localeCompare(b.displayName),
      render: (text: string, domain: DomainDescriptor) => {
        const disabled = domain.status === DomainStatus.INITIALIZING || domain.status === DomainStatus.DELETING;
        return <DisableableLink to={toDomainRoute(new DomainId(domain.namespace, domain.id), "")}
                                disabled={disabled}>{text}</DisableableLink>
      }
    }, {
      title: 'Namespace',
      dataIndex: 'namespace',
      sorter: (a: any, b: any) => (a.namespace as string).localeCompare(b.namespace)
    }, {
      title: 'Id',
      dataIndex: 'id',
      sorter: (a: any, b: any) => (a.id as string).localeCompare(b.id)
    }, {
      title: 'Status',
      dataIndex: 'status',
      align: 'left',
      render: (val: any, domain: DomainDescriptor) => (
        <span>
          <DomainStatusIcon status={domain.status}/>
          <span style={{marginLeft: 10}}>{formatDomainStatus(domain.status)}</span>
        </span>
      )
    }, {
      title: '',
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
    if (this._domainSubscription) {
      this._domainSubscription.unsubscribe();
    }

    if (this._favoritesSubscription) {
      this._favoritesSubscription.unsubscribe();
    }
  }

  public render(): ReactNode {
    return (
      <Page breadcrumbs={this._breadcrumbs}>
        <Card title={this._renderToolbar()}>
          <Table className={styles.userTable}
                 size="middle"
                 rowKey={record => record.namespace + "/" + record.id}
                 columns={this._domainTableColumns}
                 dataSource={this.state.domains || []}
          />
        </Card>
      </Page>
    );
  }

  private _renderToolbar(): ReactNode {
    return (
      <CardTitleToolbar title="Domains" icon="database">
        {this.props.configStore.namespacesEnabled ?
          <NamespaceAutoComplete placeholder={"Filter Namespace"} onChange={this._onNamespaceChange}/> : null
        }
        <span className={styles.search}>
          <Input placeholder="Search Domains" addonAfter={<Icon type="search"/>} onKeyUp={this._onFilterChange}/>
        </span>
        <Tooltip placement="topRight" title="Create Domain" mouseEnterDelay={1}>
          <Button className={styles.iconButton} shape="circle" size="small" htmlType="button"
                  onClick={this._goToCreate}>
            <Icon type="plus-circle"/>
          </Button>
        </Tooltip>
        <Tooltip placement="topRight" title="Reload Domains" mouseEnterDelay={1}>
          <Button className={styles.iconButton} shape="circle" size="small" htmlType="button"
                  onClick={this._loadDomains}>
            <Icon type="reload"/>
          </Button>
        </Tooltip>
      </CardTitleToolbar>
    )
  }

  private _renderActions = (text: any, record: DomainDescriptor) => {
    const fav = this._isFav(record);
    const favType = fav ? undefined : "dashed";
    const color = fav ? "#e3b12e" : "darkgray";
    const theme = fav ? "filled" : undefined;

    const deleteDisabled = false;
    const deleteButton = <Button className={styles.iconButton}
                                 shape="circle"
                                 size="small"
                                 htmlType="button"
                                 disabled={deleteDisabled}><Icon type="delete"/></Button>;

    const deleteComponent = deleteDisabled ?
      <Tooltip placement="topRight" title="You do not have permissions to delete this domain!" mouseEnterDelay={1}>
        {deleteButton}
      </Tooltip> :
      <Popconfirm title={`Delete domain '${record.namespace}/${record.id}'?`}
                  placement="topRight"
                  onConfirm={() => this._onDeleteDomain(record.namespace, record.id)}
                  okText="Yes"
                  cancelText="No"
                  icon={<Icon type="question-circle-o" style={{color: 'red'}}/>}
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
          <Icon type="star"
                theme={theme}
                style={{color}}/>
        </Button>
        {deleteComponent}
      </span>
    );
  }

  private _isFav(domain: DomainDescriptor): boolean {
    return this.state.favorites.find(fav => fav.equals(domain.toDomainId())) !== undefined;
  }

  private _onFavClick(domain: DomainDescriptor): void {
    const fav = this._isFav(domain);
    const promise = fav ?
      this.props.loggedInUserService.removeFavoriteDomain(domain.toDomainId()) :
      this.props.loggedInUserService.addFavoriteDomain(domain.toDomainId());

    promise
      .then(() => this.props.loggedInUserService.getFavoriteDomains())
      .then(favs => {
        const favorites = favs.map(f => f.toDomainId())
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
        notification.error({
          message: 'Could Not Delete Domain',
          description: `The domain could not be deleted.`,
        });
      });
  }

  private _loadDomains = () => {
    const domainsFilter = this.state.domainsFilter !== "" ? this.state.domainsFilter : undefined;
    const namespace = this.state.namespace !== null ? this.state.namespace : undefined;
    const {promise, subscription} =
      makeCancelable(this.props.domainService.getDomains(namespace, domainsFilter, 0, 10));
    this._domainSubscription = subscription;

    const cp = makeCancelable(this.props.loggedInUserService.getFavoriteDomains());

    this._favoritesSubscription = cp.subscription;

    Promise.all([promise, cp.promise]).then(([domains, favs]) => {
      this._domainSubscription = null;
      const favorites = favs.map(f => f.toDomainId());
      this.setState({domains, favorites});
      if (this._reloadInterval !== null) {
        clearTimeout(this._reloadInterval);
        this._reloadInterval = null;
      }

      if (domains.find(d => d.status === DomainStatus.INITIALIZING || d.status === DomainStatus.DELETING)) {
        this._reloadInterval = setInterval(this._loadDomains, 5000);
      }
    }).catch(err => {
      this._domainSubscription = null;
      this.setState({domains: null});
    });
  }
}

const injections = [SERVICES.DOMAIN_SERVICE, SERVICES.LOGGED_IN_USER_SERVICE, STORES.CONFIG_STORE];
export const Domains = injectAs<RouteComponentProps>(injections, DomainsComponent);
