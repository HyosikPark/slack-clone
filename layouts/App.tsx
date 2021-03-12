import React from 'react';
import loadable from '@loadable/component';
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LogIn = loadable(() => import('@pages/Login/LogIn'));
const SignUp = loadable(() => import('@pages/SignUp/SignUp'));
const Workspace = loadable(() => import('@layouts/Workspace/Workspace'));

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Redirect exact path="/" to="/login" />
        <Route path="/signup" component={SignUp} />
        <Route path="/login" component={LogIn} />
        <Route path="/workspace/:workspace" component={Workspace} />
      </Switch>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
