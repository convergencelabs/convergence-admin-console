/*
 * Copyright (c) 2021 - Convergence Labs, Inc.
 *
 * This file is part of the Convergence Server, which is released under
 * the terms of the GNU General Public License version 3 (GPLv3). A copy
 * of the GPLv3 should have been provided along with this file, typically
 * located in the "LICENSE" file, which is part of this source code package.
 * Alternatively, see <https://www.gnu.org/licenses/gpl-3.0.html> for the
 * full text of the GPLv3 license, if it was not provided.
 */

import React, {ReactNode} from "react";
import {Button, Card, Form, notification} from "antd";
import {DomainId} from "../../../../models/DomainId";
import {DomainSettingSection} from "../SettingsSection";
import {BooleanSelect} from "../../../../components/common/BooleanSelect/";
import {FormButtonBar} from "../../../../components/common/FormButtonBar";
import {makeCancelable, PromiseSubscription} from "../../../../utils/make-cancelable";
import {SERVICES} from "../../../../services/ServiceConstants";
import {injectAs} from "../../../../utils/mobx-utils";
import {DomainConfigService} from "../../../../services/domain/DomainConfigService";
import {CollectionConfig} from "../../../../models/domain/CollectionConfig";

export interface DomainCollectionSettingsTabProps {
  domainId: DomainId;
}

interface InjectedProps extends DomainCollectionSettingsTabProps {
  domainConfigService: DomainConfigService;
}

interface CollectionSettingsState {
  initialValue: CollectionConfig | null;
}

class DomainCollectionSettings extends React.Component<InjectedProps, CollectionSettingsState> {
  private _subscription: PromiseSubscription | null;

  constructor(props: InjectedProps) {
    super(props);

    this._subscription = null;
    this.state = {
      initialValue: null
    }
    this._loadConfig();
  }

  public render(): ReactNode {
    if (this.state.initialValue !== null) {
      return (
          <DomainSettingSection>
            <Card type="inner" title="Domain Collection Settings">
              <Form layout="vertical" onFinish={this._onFinish}>
                <Form.Item name="autoCreate"
                           label="Auto Create Collections"
                           tooltip={
                             `Enables automatic creation of a collection when a
                              models is created in a collection that does not exist`
                           }
                           initialValue={this.state.initialValue.autoCreate ? "true" : "false"}
                >
                  <BooleanSelect trueLabel="Enabled" falseLabel="Disabled"/>
                </Form.Item>
                <FormButtonBar>
                  <Form.Item>
                    <Button htmlType="submit" type="primary">Apply</Button>
                  </Form.Item>
                </FormButtonBar>
              </Form>
            </Card>
          </DomainSettingSection>
      );
    } else {
      return null;
    }
  }

  private _loadConfig = () => {
    const {promise, subscription} = makeCancelable(
        this.props.domainConfigService.getCollectionConfig(this.props.domainId));
    this._subscription = subscription;
    promise.then(initialValue => {
          this.setState({initialValue});
          this._subscription = null;
        }
    );
  }

  private _onFinish = (values: any) => {
    const {autoCreate} = values;
    const config = new CollectionConfig(autoCreate === "true");
    this.props.domainConfigService.setCollectionConfig(this.props.domainId, config)
        .then(() => {
          notification.success({
            message: 'Settings Updated',
            description: `The domain config settings were successfully updated.`
          });
        })
        .catch((err) => {
          console.error(err)
          notification.error({
            message: 'Settings Not Updated',
            description: `There was an error applying the settings.`
          });
        });
  }
}


const injections = [SERVICES.DOMAIN_CONFIG_SERVICE];
export const DomainCollectionSettingsTab = injectAs<DomainCollectionSettingsTabProps>(injections, DomainCollectionSettings);

