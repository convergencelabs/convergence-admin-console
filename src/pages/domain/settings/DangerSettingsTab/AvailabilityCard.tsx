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

import React, {Component, createRef, ReactNode} from "react";
import {DomainId} from "../../../../models/DomainId";
import {DomainService} from "../../../../services/DomainService";
import {Button, Collapse, Form, FormInstance, Select} from "antd";
import {DescriptionBox} from "../../../../components/common/DescriptionBox";
import FormItem from "antd/es/form/FormItem";
import {FormButtonBar} from "../../../../components/common/FormButtonBar";
import {SERVICES} from "../../../../services/ServiceConstants";
import {injectAs} from "../../../../utils/mobx-utils";
import {STORES} from "../../../../stores/StoreConstants";
import {ActiveDomainStore} from "../../../../stores/ActiveDomainStore";

export interface DomainAvailabilityCardProps {
  domainId: DomainId;
}

export interface InjectedProps extends DomainAvailabilityCardProps {
  domainService: DomainService;
  activeDomainStore: ActiveDomainStore;
}

export interface DomainAvailabilitySettingsState {
  loaded: boolean;
}

class DomainAvailabilityCard extends Component<InjectedProps, DomainAvailabilitySettingsState> {
  private _formRef = createRef<FormInstance>();

  constructor(props: InjectedProps) {
    super(props);

    this._getAvailability();

    this.state = {
      loaded: false
    }
  }

  public render(): ReactNode {
    return (
        <Collapse  defaultActiveKey={['1']}>
          <Collapse.Panel header="Availability" key="1">
            <DescriptionBox>
              <p>
                Setting the availability to Maintenance mode will not allow users to connect
                to the domain, but the Convergence Admin Console will be fully functional.
                Connecting users will be told that the domain is in maintenance mode. Setting
                the availability to offline, will disallow all users from connecting. The Convergence
                Admin Console will only allow the changing of settings. Users that try to connect
                will be told that the domain does not exist.
              </p>
            </DescriptionBox>
            <div>
              <Form ref={this._formRef}
                    layout="vertical"
                    onFinish={this._onFinish}>

                <FormItem name="availability"
                          label="Availability"
                          required>
                  <Select disabled={!this.state.loaded}>
                    <Select.Option value="online">Online</Select.Option>
                    <Select.Option value="maintenance">Maintenance</Select.Option>
                    <Select.Option value="offline">Offline</Select.Option>
                  </Select>
                </FormItem>
                <FormButtonBar>
                  <Button htmlType="submit" type="primary" disabled={!this.state.loaded}>Apply</Button>
                </FormButtonBar>
              </Form>
            </div>
          </Collapse.Panel>
        </Collapse>
    );
  }

  private _getAvailability(): void {
    this.props.domainService.getDomain(this.props.domainId).then(d => {
      this._formRef.current!.setFieldsValue({availability: d.availability})
      this.setState({loaded: true});
    })
  }

  private _onFinish = (values: any) => {
    const {availability} = values;
    this.props.domainService.setDomainAvailability(this.props.domainId, availability)
        .then(() =>{
          return this.props.activeDomainStore.refreshDomainDescriptor();
        });
  }
}

const injections = [SERVICES.DOMAIN_SERVICE, STORES.ACTIVE_DOMAIN_STORE];
export const DomainAvailabilitySettings = injectAs<DomainAvailabilityCardProps>(injections, DomainAvailabilityCard);
