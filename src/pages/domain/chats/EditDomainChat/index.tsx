import * as React from 'react';
import {Page} from "../../../../components/common/Page/";
import {ChangeEvent, ReactNode} from "react";
import {Card, Col, notification, Row, Select} from "antd";
import {Form, Input, Tooltip, Icon, Button} from 'antd';
import {FormComponentProps} from "antd/lib/form";
import {FormEvent} from "react";
import styles from "./styles.module.css";
import {RouteComponentProps} from "react-router";
import {FormButtonBar} from "../../../../components/common/FormButtonBar/";
import {injectAs} from "../../../../utils/mobx-utils";
import {SERVICES} from "../../../../services/ServiceConstants";
import {RestError} from "../../../../services/RestError";
import {DomainChatService} from "../../../../services/domain/DomainChatService";
import {DomainBreadcrumbProducer} from "../../DomainBreadcrumProducer";
import {domainUrl, toDomainUrl} from "../../../../utils/domain-url";
import {DomainId} from "../../../../models/DomainId";
import {Collection} from "../../../../models/domain/Collection";
import {ChatInfo} from "../../../../models/domain/ChatInfo";
import {makeCancelable, PromiseSubscription} from "../../../../utils/make-cancelable";

interface EditDomainChatProps extends RouteComponentProps<{ id: string }> {
  domainId: DomainId;
}

interface InjectedProps extends EditDomainChatProps, FormComponentProps {
  domainChatService: DomainChatService;
}

export interface EditDomainChatState {
  initialChat: ChatInfo | null;
  name: string;
  topic: string;
}

class EditDomainChatComponent extends React.Component<InjectedProps, EditDomainChatState> {
  private readonly _breadcrumbs: DomainBreadcrumbProducer;
  private _chatSubscription: PromiseSubscription | null;

  constructor(props: InjectedProps) {
    super(props);
    this._breadcrumbs = new DomainBreadcrumbProducer(this.props.domainId, [
      {title: "Chats", link: toDomainUrl("", this.props.domainId, "chats")},
      {title: "Edit Chat"}
    ]);

    this.state = {
      initialChat: null,
      name: "",
      topic: ""
    }

    this._chatSubscription = null;

    this._loadChat();
  }

  public componentWillUnmount(): void {
    if (this._chatSubscription !== null) {
      this._chatSubscription.unsubscribe();
      this._chatSubscription = null;
    }
  }

  public render(): ReactNode {
    const {getFieldDecorator} = this.props.form;
    return this.state.initialChat !== null ? (
        <Page breadcrumbs={this._breadcrumbs}>
          <Card title={<span><Icon type="folder"/> Edit Chat</span>} className={styles.formCard}>

            <Form.Item label="Chat Id">
              <Input disabled={true} value={this.state.initialChat.chatId}/>
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Chat Type">
                  <Input disabled={true} value={this.state.initialChat.type}/>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Membership">
                  <Input disabled={true} value={this.state.initialChat.membership}/>
                </Form.Item>
              </Col>
            </Row>
            <Card type="inner" title="Chat Name">
              <Form.Item>
                <Input value={this.state.name} onChange={this._onNameChange}/>
              </Form.Item>
              <FormButtonBar>
                <Button htmlType="button" type="primary" onClick={this._onSetName}>Update</Button>
              </FormButtonBar>
            </Card>
            <Card type="inner" title="Chat Topic" style={{marginTop: 20}}>
              <Form.Item>
                <Input value={this.state.topic} onChange={this._onTopicChange}/>
              </Form.Item>
              <FormButtonBar>
                <Button htmlType="button" type="primary" onClick={this._onSetTopic}>Update</Button>
              </FormButtonBar>
            </Card>
          </Card>
        </Page>
      ) :
      null;
  }

  private _onNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    this.setState({name});
  }

  private _onTopicChange = (e: ChangeEvent<HTMLInputElement>) => {
    const topic = e.target.value;
    this.setState({topic});
  }

  private _onSetName = () => {
    const {domainId, match: {params: {id}}} = this.props;
    const {name} = this.state;
    this.props.domainChatService.setChatName(domainId, id, name)
      .then(() => {
        notification.success({
          message: 'Chat Updated',
          description: `The name was successfully set for Chat '${id}'.`,
        });
      }).catch((err) => {
      if (err instanceof RestError) {
        console.log(JSON.stringify(err));
        notification.error({
          message: 'Could Not Update Chat',
          description: `Could not update the chat name`
        });
      }
    });
  }

  private _onSetTopic = () => {
    const {domainId, match: {params: {id}}} = this.props;
    const {topic} = this.state;
    this.props.domainChatService.setChatTopic(domainId, id, topic)
      .then(() => {
        notification.success({
          message: 'Chat Updated',
          description: `The topic was successfully set for Chat '${id}'.`,
        });
      }).catch((err) => {
      if (err instanceof RestError) {
        console.log(JSON.stringify(err));
        notification.error({
          message: 'Could Not Update Chat',
          description: `Could not update the chat name`
        });
      }
    });
  }

  private _loadChat(): void {
    const {id} = this.props.match.params;
    const {promise, subscription} = makeCancelable(
      this.props.domainChatService.getChat(this.props.domainId, id)
    );

    this._chatSubscription = subscription;

    promise.then(chat => {
      this.setState({
        initialChat: chat,
        name: chat.name,
        topic: chat.topic
      });
    })
  }
}

const injections = [SERVICES.DOMAIN_CHAT_SERVICE];
export const EditDomainChat =
  injectAs<EditDomainChatProps>(injections, Form.create<{}>()(EditDomainChatComponent));
