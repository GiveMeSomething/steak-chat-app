import React from 'react'
import { Switch, Route, Link } from 'react-router-dom'
import { useRouteMatch } from 'react-router'
import ChatServer from './ChatServer'

const ServersPage = () => {
    const { path, url } = useRouteMatch()
    return (
        <Switch>
            <Route exact path={path}>
                <div className="flex flex-col items-center justify-center h-screen">
                    Server Picking Page. TODO TODO TODODO
                    <Link
                        to={`${url}/1`}
                        className="px-4 py-2 rounded-md bg-slack-navbar text-white m-4 hover:text-white hover:bg-slack-sidebar-focus"
                    >
                        To example server
                    </Link>
                </div>
            </Route>
            <Route path={`${path}/:id`}>
                <ChatServer />
            </Route>
        </Switch>
    )
}

export default ServersPage
