import React, {FormEvent, ReactNode} from "react";
import {FormComponentProps} from "antd/lib/form";
import {Button, Form, InputNumber, notification} from "antd";
import {FormButtonBar} from "../../../components/common/FormButtonBar/index";
import {injectAs} from "../../../utils/mobx-utils";
import {SERVICES} from "../../../services/ServiceConstants";
import {ConfigService} from "../../../services/ConfigService";
import {makeCancelable, PromiseSubscription} from "../../../utils/make-cancelable";

export interface InjectedProps extends FormComponentProps {
  configService: ConfigService;
}

export interface SessionTimeoutState {
  timeout: number | null;
}

class SessionTimeoutComponent extends React.Component<InjectedProps, SessionTimeoutState> {
  private _configSubscription: PromiseSubscription | null;

  constructor(props: InjectedProps) {
    super(props);

    this._configSubscription = null;

    this.state = {
      timeout: null
    };

    this._loadConfig();
  }

  public render(): ReactNode {
    const {getFieldDecorator} = this.props.form;
    if (this.state.timeout !== null) {
      return (
        <Form onSubmit={this._handleSubmit} layout="horizontal">
          <Form.Item label="Session Timeout (minutes)">
            {getFieldDecorator('timeout', {initialValue: this.state.timeout})(
              <InputNumber min={1}/>
            )}
          </Form.Item>
          <FormButtonBar>
            <Button type="primary" htmlType="submit">Save</Button>
          </FormButtonBar>
        </Form>
      );
    } else {
      return (null);
    }
  }

  public componentWillUnmount(): void {
    if (this._configSubscription) {
      this._configSubscription.unsubscribe();
    }
  }

  private _handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {timeout} = values;
        this.props.configService
          .setSessionTimeoutMinutes(timeout)
          .then(() =>
            notification.success({
              message: "Configuration Saved",
              description: "The session timeout was successfully saved."
            })
          )
          .catch(err => {
            console.error(err);
            notification.error({
              message: "Configuration Not Saved",
              description: "The session timeout configuration could not be saved."
            })
          });
      }
    });
  }

  private _loadConfig(): void {
    const {promise, subscription} = makeCancelable(this.props.configService.getSessionTimeoutMinutes());
    this._configSubscription = subscription;
    promise.then(timeout => {
      this._configSubscription = null;
      this.setState({timeout});
    }).catch(err => {
      this._configSubscription = null;
      this.setState({timeout: null});
    });
  }
}

export const SessionTimeout = injectAs<{}>([SERVICES.CONFIG_SERVICE], Form.create()(SessionTimeoutComponent));
