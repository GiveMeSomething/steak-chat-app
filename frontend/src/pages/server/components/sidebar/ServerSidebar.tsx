import React, { FunctionComponent, MouseEvent, useState } from 'react'
import { useAppSelector } from 'redux/hooks'
import { selectCurrentChannel } from '../slices/channel.slice'

import ChannelsDropdown from './ChannelsDropdown'
import UsersDropdown from './usersDropdown/UsersDropdown'

interface SidebarProps {
    setChannelModalOpen: Function
}

const ServerSidebar: FunctionComponent<SidebarProps> = (props) => {
    // Always open channels menu on mount
    const [isChannelsActive, setChannelsActive] = useState<boolean>(true)
    const [isUsersActive, setUsersActive] = useState<boolean>(true)

    const currentChannel = useAppSelector(selectCurrentChannel)

    const handleOnAddChannelClick = (e: MouseEvent<HTMLDivElement>) => {
        // Stop the add button trigger close channels menu
        e.stopPropagation()

        // Open add new channel modal
        props.setChannelModalOpen(true)
    }

    return (
        <>
            <div className="flex items-center justify-between px-3 py-2 border-t-2 border-b-2 border-gray-700">
                <div className="flex items-baseline h-full">
                    <h2 className="font-bold px-3">{`# ${currentChannel.name}`}</h2>
                </div>
            </div>
            <div className="py-4">
                <div className="py-2">
                    <ChannelsDropdown
                        onAddClick={handleOnAddChannelClick}
                        isActive={isChannelsActive}
                        setActive={setChannelsActive}
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
