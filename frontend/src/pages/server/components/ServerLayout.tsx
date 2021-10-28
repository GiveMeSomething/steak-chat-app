import React, { FunctionComponent, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'redux/hooks'

import { signOutAndRemoveUser } from 'pages/auth/components/user.slice'
import { selectCurrentChannel } from './channel.slice'

import AddChannelModal from './sidebar/AddChannelModal'
import ServerSidebar from './sidebar/ServerSidebar'
import ServerNavbar from './navbar/ServerNavbar'
import Messages from './message/ServerMessages'

const ServerLayout: FunctionComponent = () => {
    const [isChannelModalOpen, setChannelModalOpen] = useState(false)

    const currentChannel = useAppSelector(selectCurrentChannel)

    const dispatch = useAppDispatch()

    const handleSignout = async () => {
        await dispatch(signOutAndRemoveUser())
    }

    return (
        <div className="fullscreen text-white overflow-hidden">
            <div className="flex flex-col w-ful h-full">
                <ServerNavbar handleSignout={handleSignout} />
                <div className="grid grid-cols-12 w-full h-full">
                    <div className="col-span-2 w-full h-full bg-slack-sidebar-normal">
                        <ServerSidebar
                            setChannelModalOpen={setChannelModalOpen}
                        />
                    </div>
                    <div className="col-span-10 w-full h-full bg-white text-gray-800">
                        <Messages currentChannel={currentChannel} />
                    </div>
                </div>
                <AddChannelModal
                    isOpen={isChannelModalOpen}
                    setOpen={setChannelModalOpen}
                />
            </div>
        </div>
    )
}

export default ServerLayout
