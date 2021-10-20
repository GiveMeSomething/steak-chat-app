import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Login from './pages/auth/Login'
import { store } from './redux/store'
import './styles/global.scss'

ReactDOM.render(
    <Provider store={store}>
        <React.StrictMode>
            <Router>
                <Switch>
                    <Route path="/auth">
                        <Login />
                    </Route>
                </Switch>
            </Router>
        </React.StrictMode>
    </Provider>,
    document.getElementById('root'),
)
