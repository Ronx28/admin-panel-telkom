/* eslint-disable no-unused-vars */
import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Data from './pages/DataDev/Data'
import Question from './pages/Question'
import Login from './pages/Login'
import index from './components/TopNav'

export default function Routes() {
  return (
    <Switch>
      <Route exact path='/' component={Dashboard} />
      <Route exact path='/users' component={Users} />
      <Route exact path='/dataDev' component={Data} />
      <Route exact path='/question' component={Question} />
      <Route exact path='/login' component={Login} />
    </Switch>
  )
}
