import React, { createContext, useState, useEffect } from 'react'

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';

import { UserContextProvider} from './userContext'

import jwtDecode from 'jwt-decode'

function App() {
  return (
    <Router>
      <UserContextProvider>
        <Navbar/>
        <Switch>
          <Route path="/" component={Home} exact/>
          <Route path="/login" component={Login}/>
          <Route path="/signup" component={Signup}/>
        </Switch>
      </UserContextProvider>
    </Router>
  );
}

export default App;
