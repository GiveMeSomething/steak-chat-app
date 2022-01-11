import React, { FunctionComponent } from 'react'
import { useAppSelector } from 'redux/hooks'

import { selectIsMetaPanelOpen } from 'components/server/metaPanel/redux/metaPanel.slice'

import MetaPanel from './metaPanel/MetaPanel'
import ServerNavbar from './navbar/ServerNavbar'
import ServerSidebar from './sidebar/ServerSidebar'
import ServerMessages from './messages/ServerMessages'
import UpdateProfileModal from './metaPanel/modal/UpdateProfileModal'

import { Toaster } from 'react-hot-toast'

interface ServerLayoutProps {}

const ServerLayout: FunctionComponent<ServerLayoutProps> = () => {
    const isMetaPanelOpen = useAppSelector(selectIsMetaPanelOpen)

    const getMessagesStyle = () => {
        if (isMetaPanelOpen) {
            return 'sm:col-span-9 lg:col-span-7'
        } else {
            return 'sm:col-span-12 lg:col-span-10'
        }
    }

    return (
        <div className="fullscreen text-white overflow-hidden">
            <div className="flex flex-col fullsize">
                <ServerNavbar />
                <div className="grid grid-cols-12 fullsize text-gray-800 bg-white">
                    <div className="col-span-2 bg-slack-sidebar-normal sm:hidden lg:block text-white">
                        <ServerSidebar />
                    </div>
                    <div className={`${getMessagesStyle()} fullsize`}>
                        <ServerMessages />
                    </div>
                    <div
                        className="col-span-3 fullsize"
                        hidden={!isMetaPanelOpen}
                    >
                        <MetaPanel />
                    </div>
                </div>
                <UpdateProfileModal />
                <Toaster />
            </div>
        </div>
    )
}

export default ServerLayout
