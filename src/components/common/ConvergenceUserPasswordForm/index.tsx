/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is part of the Convergence Server, which is released under
 * the terms of the GNU General Public License version 3 (GPLv3). A copy
 * of the GPLv3 should have been provided along with this file, typically
 * located in the "LICENSE" file, which is part of this source code package.
 * Alternatively, see <https://www.gnu.org/licenses/gpl-3.0.html> for the
 * full text of the GPLv3 license, if it was not provided.
 */

import * as React from 'react';
import {ReactNode} from 'react';
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
