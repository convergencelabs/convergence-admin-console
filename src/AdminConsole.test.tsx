import React from 'react';
import ReactDOM from 'react-dom';
import {AdminConsole} from './AdminConsole';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AdminConsole />, div);
  ReactDOM.unmountComponentAtNode(div);
});
