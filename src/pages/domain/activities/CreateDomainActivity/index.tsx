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
import {Page} from "../../../../components";
import {FolderOutlined} from '@ant-design/icons';
import {Button, Card, Form, Input, notification} from "antd";
import styles from "./styles.module.css";
import {RouteComponentProps} from "react-router";
import {FormButtonBar} from "../../../../components/common/FormButtonBar/";
import {injectAs} from "../../../../utils/mobx-utils";
import {SERVICES} from "../../../../services/ServiceConstants";
import {RestError} from "../../../../services/RestError";
import {DomainActivityService} from "../../../../services/domain/DomainActivityService";
import {toDomainRoute} from "../../../../utils/domain-url";
import {DomainId} from "../../../../models/DomainId";
import {CreateActivityData} from "../../../../services/domain/common-rest-data";

interface CreateDomainActivityProps extends RouteComponentProps {
  domainId: DomainId;
}

interface InjectedProps extends CreateDomainActivityProps {
  domainActivityService: DomainActivityService;
}

class CreateDomainActivityComponent extends React.Component<InjectedProps, {}> {
  private readonly _breadcrumbs = [
    {title: "Activities", link: toDomainRoute(this.props.domainId, "activities")},
    {title: "New Activity"}
  ];

  public render(): ReactNode {
    return (
      <Page breadcrumbs={this._breadcrumbs}>
        <Card title={<span><FolderOutlined/> New Activity</span>} className={styles.formCard}>
          <Form layout="vertical"
                onFinish={this._onFinish}>
            <Form.Item name="activityType"
                       label="Type"
                       rules={[{
                         required: true, whitespace: true, message: 'Please input an activity type!',
                       }]}
            >
              <Input/>
            </Form.Item>
            <Form.Item name="activityId"
                       label="Id"
                       rules={[{
                         required: true, whitespace: true, message: 'Please input an activity id!',
                       }]}
            >
              <Input/>
            </Form.Item>
            <FormButtonBar>
              <Button htmlType="button" onClick={this._handleCancel}>Cancel</Button>
              <Button type="primary" htmlType="submit">Create</Button>
            </FormButtonBar>
          </Form>
        </Card>
      </Page>
    );
  }

  private _handleCancel = () => {
    this.props.history.push(toDomainRoute(this.props.domainId, "activities"));
  }

  private _onFinish = (values: any) => {
    const {activityType, activityId} = values;
    const createActivityData: CreateActivityData = {
      activityType,
      activityId,
      worldPermissions: ["join", "set_state", "view_state"],
      userPermissions: {},
      groupPermissions: {}
    }

    this.props.domainActivityService.createActivity(this.props.domainId, createActivityData)
      .then(() => {
        notification.success({
          message: 'Activity Created',
          description: `Activity '${activityId}' successfully created`,
          placement: "bottomRight",
          duration: 3
        });
        this.props.history.push(toDomainRoute(this.props.domainId, "activities"));
      })
      .catch((err) => {
        let description;
        if (err instanceof RestError) {
          if (err.code === "duplicate") {
            description = `A chat with the specified ${err.details["field"]} already exists.`;
          } else {
            description = `An error was return by the server: '${err.code}'`
            console.error(err);
          }
        } else {
          description = "An unknown error occurred. Check the console for details."
          console.error(err);
        }

        notification["error"]({
          message: 'Could Not Create Activity',
          description,
          placement: "bottomRight"
        });
      });
  }
}

const injections = [SERVICES.DOMAIN_ACTIVITY_SERVICE];
export const CreateDomainActivity = injectAs<CreateDomainActivityProps>(injections, CreateDomainActivityComponent);
