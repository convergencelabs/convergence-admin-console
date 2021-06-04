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

import React, {ReactNode} from "react";
import {Page} from "../../../../components";
import {FolderOutlined} from '@ant-design/icons';
import {Button, Card, Form, Input, notification, Select} from "antd";
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

interface InjectedProps extends CreateDomainChatProps {
  domainChatService: DomainChatService;
}

class CreateDomainChatComponent extends React.Component<InjectedProps, {}> {
  private readonly _breadcrumbs = [
    {title: "Chats", link: toDomainRoute(this.props.domainId, "chats")},
    {title: "New Chat"}
  ];

  public render(): ReactNode {
    return (
        <Page breadcrumbs={this._breadcrumbs}>
          <Card title={<span><FolderOutlined/> New Chat</span>} className={styles.formCard}>
            <Form layout="vertical"
                  onFinish={this._handleSubmit}>
              <Form.Item name="chatId"
                         label="Chat Id"
                         rules={[{
                           required: true, whitespace: true, message: 'Please input a chat id!',
                         }]}
              >
                <Input/>
              </Form.Item>
              <Form.Item name="chatType"
                         label="Chat Type"
                         initialValue="channel"
              >
                <Select>
                  <Select.Option key="channel" value="channel">Channel</Select.Option>
                  <Select.Option key="room" value="room">Room</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="membership"
                         label="Membership"
                         initialValue="public">
                <Select>
                  <Select.Option key="public" value="public">Public</Select.Option>
                  <Select.Option key="private" value="private">Private</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="name"
                         label="Name">
                <Input/>
              </Form.Item>
              <Form.Item name="topic"
                         label="Topic">
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
    this.props.history.push(toDomainRoute(this.props.domainId, "chats"));
  }

  private _handleSubmit = (values: any) => {
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
}

const injections = [SERVICES.DOMAIN_CHAT_SERVICE];
export const CreateDomainChat = injectAs<CreateDomainChatProps>(injections, CreateDomainChatComponent);
