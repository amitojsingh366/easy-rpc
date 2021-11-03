import React from 'react';
import {
  BrowserRouter,
  Switch,
  Route,
} from "react-router-dom";
import Help from './pages/help';
import Home from './pages/home';

export default function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/help" component={Help} />
        <Route path="/" component={Home} />
      </Switch>
    </BrowserRouter>
  );
}

