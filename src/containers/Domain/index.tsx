import * as React from 'react';
import {Route, RouteComponentProps, Switch} from 'react-router';
import styles from './style.module.css';
import {DomainSideNavigation} from "../../components/";
import {DomainDashboard} from "../../pages/domain/Dashboard/";
import {Layout} from 'antd';
import {DomainUsers} from "../../pages/domain/Users";

const {Content} = Layout;

export class Domain extends React.Component<RouteComponentProps, {}> {
  render() {
    const { match } = this.props;
    return (
      <Layout>
        <DomainSideNavigation/>
        <Layout className={styles.scroller}>
          <Content className={styles.content}>
            <Switch>
              <Route path={`${match.url}/dashboard`} component={DomainDashboard}/>
              <Route path={`${match.url}/users`} component={DomainUsers}/>
              <Route path={`${match.url}/groups`} component={DomainDashboard}/>
              <Route path={`${match.url}/sessions`} component={DomainDashboard}/>
              <Route path={`${match.url}/collections`} component={DomainDashboard}/>
              <Route path={`${match.url}/models`} component={DomainDashboard}/>
              <Route path={`${match.url}/settings`} component={DomainDashboard}/>
              <Route exact path={`${match.url}/`} component={DomainDashboard}/>
            </Switch>
          </Content>
        </Layout>
      </Layout>
    );
  }
}
