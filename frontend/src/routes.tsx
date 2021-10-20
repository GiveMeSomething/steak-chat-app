import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Login from 'pages/auth/Login'
import Signup from 'pages/auth/Signup'

const Routes = () => {
    return (
        <Router>
            <Switch>
                <Route path="/auth/login" component={Login} />
                <Route path="/auth/signup" component={Signup} />
            </Switch>
        </Router>
    )
}

export default Routes
