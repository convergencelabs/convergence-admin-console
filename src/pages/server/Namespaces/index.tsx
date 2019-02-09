import * as React from 'react';
import {Page} from "../../../components/Page/";
import {ReactNode} from "react";
import {BasicBreadcrumbsProducer} from "../../../stores/BreacrumStore";
import {Button, Card, Icon, Input, Table} from "antd";
import styles from "./styles.module.css";
import {injectAs} from "../../../utils/mobx-utils";
import {SERVICES} from "../../../services/ServiceConstants";
import {makeCancelable, PromiseSubscription} from "../../../utils/make-cancelable";
import {RouteComponentProps} from "react-router";
import {CartTitleToolbar} from "../../../components/CardTitleToolbar";
import Tooltip from "antd/es/tooltip";
import {NamespaceAndDomains} from "../../../models/Namespace";
import {NamespaceService} from "../../../services/NamespaceService";

interface InjectedProps extends RouteComponentProps {
  namespaceService: NamespaceService;
}

interface NamespacesState {
  namespaces: NamespaceAndDomains[] | null;
}

export class NamespacesComponent extends React.Component<InjectedProps, NamespacesState> {
  private readonly breadcrumbs = new BasicBreadcrumbsProducer([{title: "Namespaces"}]);
  private readonly _domainTableColumns: any[];
  private _namepsacesSubscription: PromiseSubscription | null;

  constructor(props: InjectedProps) {
    super(props);

    this._domainTableColumns = [{
      title: 'Display Name',
      dataIndex: 'displayName',
      sorter: (a: any, b: any) => (a.displayName as string).localeCompare(b.displayName),
      render: (text: string) => <a href="javascript:;">{text}</a>
    }, {
      title: 'Id',
      dataIndex: 'id',
      sorter: (a: any, b: any) => (a.id as string).localeCompare(b.id),
      render: (text: string) => <a href="javascript:;">{text}</a>
    }, {
      title: 'Domains',
      dataIndex: 'domains',
      sorter: (a: any, b: any) => (a.id as string).localeCompare(b.id),
      render: (text: string, record: any) => record.domains.length
    }];

    this._namepsacesSubscription = null;

    this.state = {
      namespaces: null
    };

    this._loadNamespaces();
  }

  public componentWillUnmount(): void {
    if (this._namepsacesSubscription) {
      this._namepsacesSubscription.unsubscribe();
    }
  }

  public render(): ReactNode {
    return (
      <Page breadcrumbs={this.breadcrumbs.breadcrumbs()}>
        <Card title={this._renderToolbar()}>
          <Table className={styles.userTable}
                 rowKey="id"
                 size="middle"
                 columns={this._domainTableColumns}
                 dataSource={this.state.namespaces || []}
          />
        </Card>
      </Page>
    );
  }

  private _renderToolbar(): ReactNode {
    return (
      <CartTitleToolbar title="Namespaces" icon="folder">
        <span className={styles.search}>
          <Input placeholder="Search Domains" addonAfter={<Icon type="search"/>}/>
        </span>
        <Tooltip placement="topRight" title="Create Domain" mouseEnterDelay={1}>
          <Button className={styles.iconButton} shape="circle" size="small" htmlType="button"
                  onClick={this._goToCreate}>
            <Icon type="plus-circle"/>
          </Button>
        </Tooltip>
      </CartTitleToolbar>
    )
  }

  private _goToCreate = () => {
    this.props.history.push("/namesoac/create");
  }

  private _loadNamespaces(): void {
    const {promise, subscription} = makeCancelable(this.props.namespaceService.getNamespaces());
    this._namepsacesSubscription = subscription;
    promise.then(namespaces => {
      this._namepsacesSubscription = null;
      this.setState({namespaces});
    }).catch(err => {
      this._namepsacesSubscription = null;
      this.setState({namespaces: null});
    });
  }
}

export const Namespaces = injectAs<RouteComponentProps>([SERVICES.NAMESPACE_SERVICE], NamespacesComponent);
