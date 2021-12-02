import React, { FunctionComponent } from 'react'
import { useAppSelector } from 'redux/hooks'

import { selectIsMetaPanelOpen } from 'components/server/redux/metaPanel.slice'

import ServerNavbar from './navbar/ServerNavbar'
import ServerSidebar from './sidebar/ServerSidebar'
import ServerMessages from './messagePanel/ServerMessages'
import MetaPanel from './metaPanel/MetaPanel'

const ServerLayout: FunctionComponent = () => {
    const isMetaPanelOpen = useAppSelector(selectIsMetaPanelOpen)

    return (
        <div className="fullscreen text-white overflow-hidden">
            <div className="flex flex-col w-full h-full">
                <ServerNavbar />
                <div className="grid grid-cols-12 w-full h-full">
                    <div className="col-span-2 w-full h-full bg-slack-sidebar-normal">
                        <ServerSidebar />
                    </div>
                    <div
                        className={`${
                            isMetaPanelOpen ? 'col-span-7' : 'col-span-10'
                        } w-full h-full bg-white text-gray-800`}
                    >
                        <ServerMessages />
                    </div>
                    <div
                        className="col-span-3 w-full h-full bg-white text-gray-800"
                        hidden={!isMetaPanelOpen}
                    >
                        <MetaPanel />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ServerLayout