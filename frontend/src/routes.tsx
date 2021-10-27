import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Signin from 'pages/auth/Signin'
import Signup from 'pages/auth/Signup'
import ServersPage from 'pages/server/Server'

const Routes = () => {
    return (
        <Router>
            <Switch>
                <Route path="/auth/signin" exact>
                    <Signin />
                </Route>
                <Route path="/auth/signup" exact>
                    <Signup />
                </Route>
                <Route path="/servers">
                    <ServersPage />
                </Route>
                <Route path="/">
                    <Signin />
                </Route>
            </Switch>
        </Router>
    )
}

export default Routes
