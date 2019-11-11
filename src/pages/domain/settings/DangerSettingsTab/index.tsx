import React, {ChangeEvent, ReactNode} from "react";
import {injectAs} from "../../../../utils/mobx-utils";
import {SERVICES} from "../../../../services/ServiceConstants";
import {DomainId} from "../../../../models/DomainId";
import {DomainService} from "../../../../services/DomainService";
import {Button, Card, Input, notification} from "antd";
import {DescriptionBox} from "../../../../components/common/DescriptionBox";
import styles from "./styles.module.css";
import FormItem from "antd/es/form/FormItem";
import {FormButtonBar} from "../../../../components/common/FormButtonBar";
import * as H from "history";

export interface DangerousSettingsProps {
  domainId: DomainId;
  history: H.History;
}

interface InjectedProps extends DangerousSettingsProps {
  domainService: DomainService;
}

export interface DangerousSettingsState {
  domainId: string;
}

class DangerousSettingsComponent extends React.Component<InjectedProps, DangerousSettingsState> {

  constructor(props: InjectedProps) {
    super(props);

    this.state = {
      domainId: ""
    }
  }

  public render(): ReactNode {
    return (
      <Card type="inner" title={"Delete Domain"} className={styles.dangerSettings}>
        <DescriptionBox>
          <p>
            Proceed with caution. All users, settings, models, and other data within the domain will be permanently
            destroyed. To delete the domain, type in domain id <span className={styles.domainId}>{this.props.domainId.id}</span> below and press the
            'Delete' button.
          </p>
          <span className={styles.warning}>Warning: Deleting a domain not be undone.</span>
        </DescriptionBox>
        <div>
          <FormItem label="Domain Id">
            <Input value={this.state.domainId} onChange={this._onDomainIdChange}/>
          </FormItem>
          <FormButtonBar>
            <Button
              htmlType="button"
              type="danger"
              disabled={this.props.domainId.id !== this.state.domainId}
              onClick={this._onDelete}
            >Delete</Button>
          </FormButtonBar>
        </div>
      </Card>
    );
  }

  private _onDomainIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    const domainId = e.target.value;
    this.setState({domainId});
  }

  private _onDelete = () => {
    const domainId = this.props.domainId;
    this.props.domainService
      .deleteDomain(this.props.domainId)
      .then(() => {
        notification.success({
          message: "Domain Deleted",
          description: `The domain '${domainId.namespace}/${domainId.id}' successfully deleted`
        });
        this.props.history.push("/");
      })
      .catch(err => {
        console.error(err);
        notification.error({
          message: "Domain Not Deleted",
          description: `The domain '${domainId.namespace}/${domainId.id}' could not be deleted`
        });
      })
  }
}

const injections = [SERVICES.DOMAIN_SERVICE];
export const DangerousSettings = injectAs<DangerousSettingsProps>(injections, DangerousSettingsComponent);
