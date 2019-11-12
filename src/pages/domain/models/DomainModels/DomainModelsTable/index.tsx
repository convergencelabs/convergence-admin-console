/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import * as React from 'react';
import {ReactNode} from 'react';
import moment from "moment";
import {Table, Tooltip} from "antd";
import {Link} from "react-router-dom";
import styles from "./styles.module.css";
import {Model} from '../../../../../models/domain/Model';
import {TypeChecker} from "../../../../../utils/TypeChecker";
import {longDateTime, shortDateTime, truncate} from "../../../../../utils/format-utils";
import {PagedData} from '../../../../../services/domain/common-rest-data';
import {SearchParams} from '../index';
import {ModelSearchMode} from '../ModelControls';
import {ModelDropdownMenu} from '../ModelDropdownMenu';
import {ModelRowExpanded} from '../ModelRowExpanded';
import {DomainId} from '../../../../../models/DomainId';
import {toDomainRoute} from '../../../../../utils/domain-url';
import {History} from 'history';
import {appendToQueryParamString} from '../../../../../utils/router-utils';

interface DomainModelsTableProps {
  history: History;
  pagedModels: PagedData<Model>;
  searchParams: SearchParams;
  loading: boolean;
  domainId: DomainId;
  onDeleteConfirm: (modelId: string) => void;
}

export class DomainModelsTable extends React.Component<DomainModelsTableProps, {}> {
  private readonly _metaColumns: any[];

  constructor(props: DomainModelsTableProps) {
    super(props);

    this._metaColumns = [{
      title: 'Id',
      dataIndex: 'id',
      width: 120,
      sorter: (a: Model, b: Model) => (a.id as string).localeCompare(b.id),
      render: this._renderMenu
    }, {
      title: 'Version',
      dataIndex: 'version',
      width: 100,
      sorter: true,
      align: "right"
    }, {
      title: 'Modified',
      dataIndex: 'modified',
      width: 180,
      render: (val: Date, record: Model) => shortDateTime(val),
      sorter: (a: Model, b: Model) => a.modified.getTime() - b.modified.getTime()
    }];
  }

  public render(): ReactNode {
    const pagination = this.props.searchParams.mode === ModelSearchMode.BROWSE ? {
      pageSize: this.props.searchParams.pageSize,
      current: this.props.searchParams.page,
      total: this.props.pagedModels.totalResults,
      onChange: this._pageChange,
      showTotal: (total: number) => `${total} total results`
    } : false;

    const columns = this._buildColumns();

    return (
      <div className={styles.tableWrapper}>
        <Table columns={columns}
          size="middle"
          rowKey="id"
          bordered={true}
          loading={this.props.loading}
          dataSource={this.props.pagedModels.data}
          expandedRowRender={this._expander}
          pagination={pagination}
        />
      </div>
    );
  }

  private _buildColumns(): any[] {
    const dataCols: Map<string, any> = new Map();
    this.props.pagedModels.data.forEach(model => {
      const data = model.data!;
      Object.keys(data).forEach(key => {
        dataCols.set(key, typeof data[key]);
      });
    });

    const columns: any[] = this._metaColumns.slice(0);
    dataCols.forEach((type, column) => {
      columns.push({
        title: column,
        dataIndex: `data.${column}`,
        render: this._renderDataValue
      });
    });
    
    return columns;
  }

  private _renderDataValue = (val: any, record: Model) => {
    const renderedValue = TypeChecker.switch<string>(val, {
      null() {
        return "null";
      },
      string(val: string) {
        return val;
      },
      date(val: Date) {
        return moment(val).format();
      },
      undefined() {
        return "";
      },
      object(obj: any) {
        return JSON.stringify(obj);
      },
      array(arr: any[]) {
        return JSON.stringify(arr);
      },
      number(val: number) {
        return val + ""
      },
      boolean(val: boolean) {
        return val + ""
      },
      custom: [
        {
          test(value: any): boolean {
            return TypeChecker.isObject(value) && value["$$convergence_type"] === "date";
          },
          callback(value: any): string {
            const longDate = value["date"];
            const date = new Date(longDate);
            return longDateTime(date);
          }
        }
      ]
    });

    return (<div className={styles.dataValue}>{renderedValue}</div>);
  }

  private _expander = (model: Model) => {
    return (
      <ModelRowExpanded 
        record={model} 
        domainId={this.props.domainId} 
        onDeleteConfirm={this.props.onDeleteConfirm} 
      />
    );
  }

  private _renderMenu = (id: string, record: Model) => {
    const data = toDomainRoute(this.props.domainId, `models/${id}`);
    return (
      <div style={{display: "flex", alignItems: "center"}}>
        <Tooltip title={id}>
          <Link to={data} style={{flex: 1}}>{truncate(id, 10)}</Link>
        </Tooltip>
        <ModelDropdownMenu id={id} record={record} domainId={this.props.domainId} onDeleteConfirm={this.props.onDeleteConfirm} />
      </div>
    );
  }

  private _pageChange = (page: number, pageSize?: number) => {
    let newUrl = appendToQueryParamString({page, pageSize});
    this.props.history.push(newUrl);
  }

}
