import React from 'react';
import { render } from 'react-dom';

import App from '@layouts/App';
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL =
  process.env.NODE_ENV === 'production' ? 'https://sleact.nodebird.com' : 'http://localhost:3090';

render(<App />, document.querySelector('#app'));
