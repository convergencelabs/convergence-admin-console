import * as React from 'react';
import styles from './styles.module.css';
import {DomainDescriptor} from "../../models/DomainDescriptor";
import {Card} from "antd";
import {Link} from "react-router-dom";

export interface DomainCardProps {
  domain: DomainDescriptor
}

export class DomainCard extends React.Component<DomainCardProps,{}> {
  render() {
    const domain = this.props.domain;
     return (
       <Card className={styles.domainCard}>
         <Link to={{pathname: `/domain/${domain.namespace}/${domain.id}/`}}>
           <span className={styles.title}>{domain.title}</span>
         </Link>
         <div className={styles.nsid}>{domain.namespace} / {domain.id}</div>
       </Card>
     )
  }
}
