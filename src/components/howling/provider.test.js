import React from 'react';
import ReactDOM from 'react-dom';

import HowlingProvider from './provider';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <HowlingProvider src="mock.ogg">
      <span/>
    </HowlingProvider>, div);
});
