import * as React from 'react';
import {Route, RouteComponentProps, Switch} from 'react-router';
import { Layout } from 'antd';
import styles from './style.module.css';
import {AppHeader} from "../../components/AppHeader";
import {Domains} from "../../pages/Domains";
import {Domain} from "../Domain";
import {AppBreadcrumbs} from "../../components/AppBreadcrumbs";

export class Main extends React.Component<RouteComponentProps, {}> {
  render() {
    return (
      <div className={styles.app}>
        <Layout>
          <AppHeader/>
          <AppBreadcrumbs/>
          <Switch>
            <Route exact path='/' component={Domains}/>
            <Route exact path='/domains' component={Domains}/>
            <Route path='/domain/:namespace/:id/' component={Domain}/>
          </Switch>
        </Layout>
      </div>
    );
  }
}
