import React, {FormEvent, ReactNode} from "react";
import {Button, Col, Form, Input, notification, Row} from "antd";
import {FormComponentProps} from "antd/lib/form";
import {injectAs} from "../../../../utils/mobx-utils";
import {SERVICES} from "../../../../services/ServiceConstants";
import {DomainId} from "../../../../models/DomainId";
import {FormButtonBar} from "../../../common/FormButtonBar";
import {makeCancelable, PromiseSubscription} from "../../../../utils/make-cancelable";
import {DomainService} from "../../../../services/DomainService";
import {DomainDescriptor} from "../../../../models/DomainDescriptor";

export interface DomainBasicSettingsFormProps {
  domainId: DomainId;
}

interface InjectedProps extends DomainBasicSettingsFormProps, FormComponentProps {
  domainService: DomainService;
}

export interface DomainBasicSettingsFormState {
  initialValue: DomainDescriptor | null;
}

class DomainBasicSettingsForm extends React.Component<InjectedProps, DomainBasicSettingsFormState> {
  private _subscription: PromiseSubscription | null;

  constructor(props: InjectedProps) {
    super(props);

    this.state = {
      initialValue: null
    }

    this._subscription = null;

    this._loadConfig();
  }

  public componentWillUnmount(): void {
    if (this._subscription !== null) {
      this._subscription.unsubscribe();
    }
  }

  public render(): ReactNode {
    if (this.state.initialValue !== null) {
      const {getFieldDecorator} = this.props.form;
      return (
        <Form onSubmit={this._handleSubmit}>
          <Row>
            <Col span={24}>
              <Form.Item label="Display Name">
                {getFieldDecorator('displayName', {
                  rules: [{required: true, message: "A display name is required!"}],
                  initialValue: this.state.initialValue.displayName
                })(
                  <Input placeholder="Enter a Display Name"/>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormButtonBar>
                <Button type="primary" htmlType="submit">Apply</Button>
              </FormButtonBar>
            </Col>
          </Row>
        </Form>
      );
    } else {
      return null;
    }
  }

  private _handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values: any) => {
      if (!err) {
        const {displayName} = values;
        this.props.domainService.updateDomain(this.props.domainId, displayName)
          .then(() => {
            notification.success({
              message: 'Domain Info Updated',
              description: `The domain info was successfully updated.`
            });
          })
          .catch((err) => {
            notification.error({
              message: 'Could Not Update Domain',
              description: `The domain info could not be updated.`
            });
          });
      }
    });
  }

  private _loadConfig = () => {
    const {promise, subscription} = makeCancelable(
      this.props.domainService.getDomain(this.props.domainId));
    this._subscription = subscription;
    promise.then(domain => {
        this.setState({initialValue: domain});
        this._subscription = null;
      }
    );
  }
}

const injections = [SERVICES.DOMAIN_SERVICE];
export const DomainBasicSettings = injectAs<DomainBasicSettingsFormProps>(injections, Form.create()(DomainBasicSettingsForm));
