import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Login from 'pages/auth/Login'
import Signup from 'pages/auth/Signup'
import ChatServer from 'pages/server/ChatServer'

const Routes = () => {
    return (
        <Router>
            <Switch>
                <Route path="/auth/login">
                    <Login />
                </Route>
                <Route path="/auth/signup">
                    <Signup />
                </Route>
                <Route path="/server/:id">
                    <ChatServer />
                </Route>
            </Switch>
        </Router>
    )
}

export default Routes
