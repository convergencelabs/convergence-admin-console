import * as React from 'react';
import {Route, RouteComponentProps, Switch} from 'react-router';
import {Layout} from 'antd';
import styles from './style.module.css';
import {AppHeader} from "../../components/AppHeader";
import {DomainContainer} from "../Domain";
import {AppBreadcrumbs} from "../../components/AppBreadcrumbs";
import {ServerContainer} from "../Server";

export class MainLayout extends React.Component<RouteComponentProps, {}> {
  render() {
    return (
      <div className={styles.mainLayout}>
        <Layout>
          <AppHeader/>
          <AppBreadcrumbs/>
          <Switch>
            <Route path='/domain/:namespace/:domainId/' component={DomainContainer}/>
            <Route path='/' component={ServerContainer}/>
          </Switch>
        </Layout>
      </div>
    );
  }
}
