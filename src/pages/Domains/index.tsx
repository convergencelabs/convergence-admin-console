import * as React from 'react';
import {Page} from "../../components/Page";
import {ReactNode} from "react";
import {domainStore} from "../../stores/DomainStore";
import {DomainCard} from "../../components/DomainCard";

export class Domains extends React.Component<{}, {}> {

  _renderDomains(): ReactNode[] {
    return domainStore.domains.map(d => <DomainCard domain={d}/>);
  }

  render(): ReactNode {
    return (
      <Page breadcrumbs={[]}>
        {this._renderDomains()}
      </Page>
    );
  }
}
