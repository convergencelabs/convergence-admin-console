/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import * as React from 'react';
import {ReactNode} from 'react';
import AceEditor from "react-ace";
import {Link} from "react-router-dom";
import {Popconfirm} from 'antd';
import "brace";
import 'brace/mode/json';
import 'brace/theme/solarized_dark';
import styles from "./styles.module.css";
import {ToolbarButton} from "../../../../../components/common/ToolbarButton";
import {Model} from '../../../../../models/domain/Model';
import {DomainId} from '../../../../../models/DomainId';
import {toDomainRoute} from "../../../../../utils/domain-url";
import {longDateTime} from "../../../../../utils/format-utils";

interface ModelRowExpandedProps {
  record: Model;
  domainId: DomainId;
  onDeleteConfirm: (id: string) => void;
}

export class ModelRowExpanded extends React.Component<ModelRowExpandedProps, {}> {

  public render(): ReactNode {
    const permission = toDomainRoute(this.props.domainId, `models/${this.props.record.id}/permissions`);
    const data = toDomainRoute(this.props.domainId, `models/${this.props.record.id}`);

    return (
      <div className={styles.modelExpander}>
        <div className={styles.modelExpanderToolbar}>
          <Link to={data}>
            <ToolbarButton icon="edit" tooltip="Edit Model"/>
            </Link>
          <Link to={permission}>
            <ToolbarButton icon="team" tooltip="Edit Permissions"/>
          </Link>
          <Popconfirm title="Delete this model?" onConfirm={() => this.props.onDeleteConfirm(this.props.record.id)}>
            <ToolbarButton icon="delete" tooltip="Delete Model"/>
          </Popconfirm>
        </div>
        <table>
          <tbody>
          <tr>
            <td>Id:</td>
            <td>{this.props.record.id}</td>
          </tr>
          <tr>
            <td>Collection:</td>
            <td>{this.props.record.collection}</td>
          </tr>
          <tr>
            <td>Version:</td>
            <td>{this.props.record.version}</td>
          </tr>
          <tr>
            <td>Created Time:</td>
            <td>{longDateTime(this.props.record.created)}</td>
          </tr>
          <tr>
            <td>Modified Time:</td>
            <td>{longDateTime(this.props.record.modified)}</td>
          </tr>
          <tr>
            <td>Data:</td>
            <td>
              <div className={styles.editorContainer}>
                <AceEditor
                  className={styles.editor}
                  value={JSON.stringify(this.props.record.data, null, "  ")}
                  readOnly={true}
                  theme="solarized_dark"
                  mode="json"
                  name={"ace_" + this.props.record.id}
                  width="100%"
                  height="300px"
                  highlightActiveLine={true}
                  showPrintMargin={false}
                  wrapEnabled={true}
                />
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

