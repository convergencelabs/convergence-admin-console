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

import React, {FormEvent, ReactNode} from "react";
import {Page} from "../../../../components/common/Page/";
import {Button, Card, Form, Icon, Input, notification, Select} from "antd";
import {FormComponentProps} from "antd/lib/form";
import styles from "./styles.module.css";
import {RouteComponentProps} from "react-router";
import {FormButtonBar} from "../../../../components/common/FormButtonBar/";
import {injectAs} from "../../../../utils/mobx-utils";
import {SERVICES} from "../../../../services/ServiceConstants";
import {RestError} from "../../../../services/RestError";
import {DomainChatService} from "../../../../services/domain/DomainChatService";
import {toDomainRoute} from "../../../../utils/domain-url";
import {DomainId} from "../../../../models/DomainId";

interface CreateDomainChatProps extends RouteComponentProps {
  domainId: DomainId;
}

interface InjectedProps extends CreateDomainChatProps, FormComponentProps {
  domainChatService: DomainChatService;
}

class CreateDomainChatComponent extends React.Component<InjectedProps, {}> {
  private readonly _breadcrumbs = [
    {title: "Chats", link: toDomainRoute(this.props.domainId, "chats")},
    {title: "New Chat"}
  ];

  public render(): ReactNode {
    const {getFieldDecorator} = this.props.form;
    return (
      <Page breadcrumbs={this._breadcrumbs}>
        <Card title={<span><Icon type="folder"/> New Chat</span>} className={styles.formCard}>
          <Form onSubmit={this.handleSubmit}>
            <Form.Item label="Chat Id">
              {getFieldDecorator('chatId', {
                rules: [{
                  required: true, whitespace: true, message: 'Please input a chat id!',
                }],
              })(
                <Input/>
              )}
            </Form.Item>
            <Form.Item label="Chat Type">
              {getFieldDecorator('chatType', {initialValue: "channel"})(
                <Select>
                  <Select.Option key="channel" value="channel">Channel</Select.Option>
                  <Select.Option key="room" value="room">Room</Select.Option>
                </Select>
              )}
            </Form.Item>
            <Form.Item label="Membership">
              {getFieldDecorator('membership', {initialValue: "public"})(
                <Select>
                  <Select.Option key="public" value="public">Public</Select.Option>
                  <Select.Option key="private" value="private">Private</Select.Option>
                </Select>
              )}
            </Form.Item>
            <Form.Item label="Name">
              {getFieldDecorator('name', {})(
                <Input/>
              )}
            </Form.Item>
            <Form.Item label="Topic">
              {getFieldDecorator('topic', {})(
                <Input/>
              )}
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
    this.props.history.push(toDomainRoute(this.props.domainId, "chats"));
  }

  private handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values: any) => {
      if (!err) {
        const {chatId, chatType, membership, name, topic} = values;
        const createChatData = {
          chatId,
          chatType,
          membership,
          name,
          topic,
          members: []
        }
        this.props.domainChatService.createChat(this.props.domainId, createChatData)
          .then(() => {
            notification.success({
              message: 'Chat Created',
              description: `Chat '${chatId}' successfully created`,
              placement: "bottomRight",
              duration: 3
            });
            this.props.history.push(toDomainRoute(this.props.domainId, "chats"));
          }).catch((err) => {
          if (err instanceof RestError) {
            console.log(JSON.stringify(err));
            if (err.code === "duplicate") {
              notification["error"]({
                message: 'Could Not Create Chat',
                description: `A chat with the specified ${err.details["field"]} already exists.`,
                placement: "bottomRight"
              });
            }
          }
        });
      }
    });
  }
}

const injections = [SERVICES.DOMAIN_CHAT_SERVICE];
export const CreateDomainChat =
  injectAs<CreateDomainChatProps>(injections, Form.create()(CreateDomainChatComponent));
