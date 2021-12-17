import React from 'react'
import ReactDOM from 'react-dom'

import 'semantic-ui-css/semantic.min.css'
import './styles/global.scss'

import { Provider } from 'react-redux'
import { store } from './redux/store'

import Routes from 'routes'

ReactDOM.render(
    <Provider store={store}>
        <Routes />
    </Provider>,
    document.getElementById('root')
)
