import * as React from 'react';
import {ReactNode} from "react";
import {PasswordConfig} from "../../../models/PasswordConfig";
import {SetPasswordForm} from "../SetPasswordForm/";
import {SERVICES} from "../../../services/ServiceConstants";
import {injectAs} from "../../../utils/mobx-utils";
import {ConfigService} from "../../../services/ConfigService";

interface ConvergenceUserPasswordFormProps {
  onSetPassword(password: string): Promise<boolean>;

  onCancel?: () => void;
  showCancel?: boolean;
  okButtonText?: string;
}

interface InjectedProps extends ConvergenceUserPasswordFormProps {
  configService: ConfigService;
}

interface ChangePasswordFormComponentState {
  passwordConfig: PasswordConfig | null;
}

class ConvergenceUserPassword extends React.Component<InjectedProps, ChangePasswordFormComponentState> {

  constructor(props: InjectedProps) {
    super(props);

    this.state = {
      passwordConfig: null
    };

    this.props.configService
      .getPasswordConfig()
      .then((config: PasswordConfig) => {
        this.setState({passwordConfig: config});
      });
  }

  public render(): ReactNode {
    if (this.state.passwordConfig) {
      return (
        <SetPasswordForm {...this.props} passwordConfig={this.state.passwordConfig}/>
      );
    } else {
      return null;
    }
  }
}

const injections = [SERVICES.CONFIG_SERVICE];
export const ConvergenceUserPasswordForm =
  injectAs<ConvergenceUserPasswordFormProps>(injections, ConvergenceUserPassword);
