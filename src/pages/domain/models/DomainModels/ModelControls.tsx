import * as React from 'react';
import {ReactNode} from "react";
import {Input, InputNumber, Select} from "antd";
import {Form, Button} from 'antd';
import {FormComponentProps} from "antd/lib/form";
import {CollectionAutoComplete} from "../../../../components/CollectionAutoComplete";
import {DomainId} from "../../../../models/DomainId";
import styles from "./styles.module.css";

const {Option} = Select;

type SearchMode = "browse" | "query" | "id"

interface BrowseModelControlsProps {
  domainId: DomainId;
  resultsPerPageDefault: number;
  onBrowse(collection: string, perPage: number): void;
  onQuery(query: string, perPage: number): void;
  onIdLookup(modelId: string, perPage: number): void;
}

interface InjectedProps extends BrowseModelControlsProps, FormComponentProps {

}

interface ModelControlsState {
  mode: SearchMode;
}

class ModelControlsComponent extends React.Component<InjectedProps, ModelControlsState> {

  constructor(props: InjectedProps) {
    super(props);
  }

  public render(): ReactNode {
    const {getFieldDecorator} = this.props.form;
    const mode = this.props.form.getFieldValue("mode") as string | "browse";
    let fieldLabel = "";
    let buttonLabel = "";
    if (mode === "browse") {
      fieldLabel = "Collection";
      buttonLabel = "Browse"
    } else if (mode === "query") {
      fieldLabel = "Query";
      buttonLabel = "Query"
    }  else if (mode === "id") {
      fieldLabel = "Model Id";
      buttonLabel = "Search"
    }
    return (
      <div className={styles.toolbar}>
        <div className={styles.modeSelector}>
          <span className={styles.label}>Mode:</span>
          {getFieldDecorator('mode', {initialValue: "browse"})(
            <Select style={{width: 150}}>
              <Option key="browse">Browse</Option>
              <Option key="query">Query</Option>
              <Option key="id">Id Lookup</Option>
            </Select>
          )}
        </div>
        <span className={styles.label}>{fieldLabel}:</span>
        {
          mode === "browse" ?
          getFieldDecorator('collection')(
            <CollectionAutoComplete className={styles.collection} domainId={this.props.domainId}/>
          ) : null
        }
        {
          mode === "query" ?
            getFieldDecorator('query')(
              <Input className={styles.query} placeholder="Enter Query"/>
            ) : null
        }
        {
          mode === "id" ?
            getFieldDecorator('id')(
              <Input className={styles.id} placeholder="Enter Model Id"/>
            ) : null
        }
        <span className={styles.label}>Results Per Page:</span>
        {getFieldDecorator('resultsPerPage', {initialValue: this.props.resultsPerPageDefault || 20})(
          <InputNumber/>
        )}
        <Button htmlType="button" type="primary" className={styles.button} onClick={this._handleSubmit}>{buttonLabel}</Button>
      </div>
    );
  }

  private _handleSubmit = () => {
    this.props.form.validateFieldsAndScroll((err: any, values: any) => {
      if (!err) {
        const {mode, collection, query, id, resultsPerPage} = values;
        switch (mode) {
          case "browse":
            this.props.onBrowse(collection, resultsPerPage);
            break;
          case "query":
            this.props.onQuery(query, resultsPerPage);
            break;
          case "id":
            this.props.onIdLookup(id, resultsPerPage);
            break;
        }
      }
    });
  }
}

export const ModelControls = Form.create<{}>()(ModelControlsComponent);
