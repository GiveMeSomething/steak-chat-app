import React, { FunctionComponent, useState } from 'react'

import ChannelsDropdown from './channels/ChannelsDropdown'
import StarredDropdown from './channels/StarredDropdown'
import UsersDropdown from './users/UsersDropdown'

interface ServerSidebarProps {}

const ServerSidebar: FunctionComponent<ServerSidebarProps> = () => {
    // Always open channels menu on mount
    const [isStarredActive, setStarredActive] = useState<boolean>(true)
    const [isChannelActive, setChannelActive] = useState<boolean>(true)
    const [isUsersActive, setUsersActive] = useState<boolean>(true)

    return (
        <>
            <div className="flex items-center justify-between px-3 py-2 border-t-2 border-b-2 border-gray-700">
                <div className="flex items-baseline h-full">
                    <h2 className="font-bold px-3">Server Name</h2>
                </div>
            </div>
            <div className="py-4">
                <div className="py-2">
                    <StarredDropdown
                        isActive={isStarredActive}
                        setActive={setStarredActive}
                    />
                </div>
                <div className="py-2">
                    <ChannelsDropdown
                        isActive={isChannelActive}
                        setActive={setChannelActive}
                    />
                </div>
                <div className="py-2">
                    <UsersDropdown
                        isActive={isUsersActive}
                        setActive={setUsersActive}
                    />
                </div>
            </div>
        </>
    )
}

export default ServerSidebar
