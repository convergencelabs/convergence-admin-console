import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {App} from './App';
import {configure} from "mobx"
import {domainStore} from "./stores/DomainStore";
import {DomainDescriptor} from "./models/DomainDescriptor";
import {DomainStatus} from "./models/DomainStatus";


configure({enforceActions: "always"});

domainStore.setDomains([
  new DomainDescriptor("my-namespace", "my-id", "My Domain", "michael", DomainStatus.ONLINE)
]);

ReactDOM.render(<App />, document.getElementById('root'));
