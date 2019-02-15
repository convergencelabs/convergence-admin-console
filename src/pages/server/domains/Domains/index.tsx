import * as React from 'react';
import {Page} from "../../../../components/Page/";
import {ReactNode} from "react";
import {BasicBreadcrumbsProducer} from "../../../../stores/BreacrumStore";
import {Button, Card, Icon, Input, notification, Popconfirm, Table} from "antd";
import styles from "./styles.module.css";
import {injectAs} from "../../../../utils/mobx-utils";
import {SERVICES} from "../../../../services/ServiceConstants";
import {DomainService} from "../../../../services/DomainService";
import {makeCancelable, PromiseSubscription} from "../../../../utils/make-cancelable";
import {DomainDescriptor} from "../../../../models/DomainDescriptor";
import {RouteComponentProps} from "react-router";
import {CartTitleToolbar} from "../../../../components/CardTitleToolbar/";
import Tooltip from "antd/es/tooltip";
import {KeyboardEvent} from "react";
import {NamespaceAndDomains} from "../../../../models/NamespaceAndDomains";
import {Link} from "react-router-dom";

interface InjectedProps extends RouteComponentProps {
  domainService: DomainService;
}

interface DomainsState {
  domains: DomainDescriptor[] | null;
  domainsFilter: string;
}

export class DomainsComponent extends React.Component<InjectedProps, DomainsState> {
  private readonly breadcrumbs = new BasicBreadcrumbsProducer([{title: "Domains"}]);
  private readonly _domainTableColumns: any[];
  private _domainSubscription: PromiseSubscription | null;

  constructor(props: InjectedProps) {
    super(props);

    this._domainTableColumns = [{
      title: 'Display Name',
      dataIndex: 'displayName',
      sorter: (a: any, b: any) => (a.displayName as string).localeCompare(b.displayName),
      render: (text: string, record: any) => <Link to={`domains/${record.id}`}>{text}</Link>
    }, {
      title: 'Namespace',
      dataIndex: 'namespace',
      sorter: (a: any, b: any) => (a.namespace as string).localeCompare(b.namespace)
    }, {
      title: 'Id',
      dataIndex: 'id',
      sorter: (a: any, b: any) => (a.id as string).localeCompare(b.id)
    }, {
      title: 'Owner',
      dataIndex: 'owner',
      key: 'owner',
      align: 'left'
    }, {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'left'
    },
      {
        title: '',
        dataIndex: '',
        width: '50px',
        render: this._renderActions
      }];

    this._domainSubscription = null;

    this.state = {
      domains: null,
      domainsFilter: ""
    };

    this._loadDomains();
  }

  public componentWillUnmount(): void {
    if (this._domainSubscription) {
      this._domainSubscription.unsubscribe();
    }
  }

  public render(): ReactNode {
    return (
      <Page breadcrumbs={this.breadcrumbs.breadcrumbs()}>
        <Card title={this._renderToolbar()}>
          <Table className={styles.userTable}
                 size="middle"
                 columns={this._domainTableColumns}
                 dataSource={this.state.domains || []}
          />
        </Card>
      </Page>
    );
  }

  private _renderToolbar(): ReactNode {
    return (
      <CartTitleToolbar title="Domains" icon="database">
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
      </CartTitleToolbar>
    )
  }

  private _renderActions = (text: any, record: DomainDescriptor) => {
    const deleteDisabled = false;
    const deleteButton = <Button shape="circle" size="small" htmlType="button" disabled={deleteDisabled}><Icon
      type="delete"/></Button>;

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

    return (<span className={styles.actions}>{deleteComponent}</span>);
  }

  private _goToCreate = () => {
    this.props.history.push("/create-domain");
  }

  private _onFilterChange = (event: KeyboardEvent<HTMLInputElement>) => {
    this.setState({domainsFilter: (event.target as HTMLInputElement).value}, this._loadDomains);
  }

  private _onDeleteDomain = (namespace: string, id: string) => {
    this.props.domainService.deleteDomain(namespace, id)
      .then(() => {
        this._loadDomains();
        notification.success({
          message: 'Success',
          description: `Domain '${namespace}/${id}' deleted.`,
        });
      })
      .catch(err => {
        notification.error({
          message: 'Could Not Delete Namespace',
          description: `The domain could not be deleted.`,
        });
      });
  }

  private _loadDomains = () => {
    const {promise, subscription} =
      makeCancelable(this.props.domainService.getDomains(this.state.domainsFilter, 0, 10));
    this._domainSubscription = subscription;
    promise.then(domains => {
      this._domainSubscription = null;
      this.setState({domains});
    }).catch(err => {
      this._domainSubscription = null;
      this.setState({domains: null});
    });
  }
}

export const Domains = injectAs<RouteComponentProps>([SERVICES.DOMAIN_SERVICE], DomainsComponent);
