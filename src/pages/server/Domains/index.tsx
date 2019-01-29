import * as React from 'react';
import {Page} from "../../../components/Page/";
import {ReactNode} from "react";
import {BasicBreadcrumbsProducer} from "../../../stores/BreacrumStore";
import {Button, Card, Icon, Input, Table} from "antd";
import styles from "./styles.module.css";
import {injectAs} from "../../../utils/mobx-utils";
import {SERVICES} from "../../../services/ServiceConstants";
import {DomainService} from "../../../services/DomainService";
import {makeCancelable, PromiseSubscription} from "../../../utils/make-cancelable";
import {DomainDescriptor} from "../../../models/DomainDescriptor";
import {RouteComponentProps} from "react-router";
import {CartTitleToolbar} from "../../../components/CardTitleToolbar";
import Tooltip from "antd/es/tooltip";

interface InjectedProps extends RouteComponentProps {
  domainService: DomainService;
}

interface DomainsState {
  domains: DomainDescriptor[] | null;
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
      render: (text: string) => <a href="javascript:;">{text}</a>
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
    }];

    this._domainSubscription = null;

    this.state = {
      domains: null
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
          <Input placeholder="Search Domains" addonAfter={<Icon type="search"/>}/>
        </span>
        <Tooltip placement="topRight" title="Create Domain" mouseEnterDelay={1}>
          <Button className={styles.iconButton} shape="circle" size="small" htmlType="button" onClick={this._goToCreate}>
            <Icon type="plus-circle"/>
          </Button>
        </Tooltip>
      </CartTitleToolbar>
    )
  }

  private _goToCreate = () => {
    this.props.history.push("/domains/create");
  }

  private _loadDomains(): void {
    const {promise, subscription} = makeCancelable(this.props.domainService.getDomains());
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
