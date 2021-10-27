import React, { FunctionComponent, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'redux/hooks'

import {
    fetchUser,
    selectCurrentUser,
    signOutAndRemoveUser,
} from 'pages/auth/components/user.slice'
import { selectCurrentChannel } from './channel.slice'

import AddChannelModal from './sidebar/AddChannelModal'
import ServerSidebar from './sidebar/ServerSidebar'
import ServerNavbar from './navbar/ServerNavbar'
import Messages from './message/Messages'

const ServerLayout: FunctionComponent = () => {
    const [isChannelModalOpen, setChannelModalOpen] = useState(false)

    const currentUser = useAppSelector(selectCurrentUser)
    const currentChannel = useAppSelector(selectCurrentChannel)

    const dispatch = useAppDispatch()

    useEffect(() => {
        // Get user info when load
        fetchUserInfo()
    }, [])

    const handleSignout = async () => {
        await dispatch(signOutAndRemoveUser())
    }

    const fetchUserInfo = async () => {
        if (currentUser.user) {
            await dispatch(fetchUser({ uid: currentUser.user?.uid }))
        }
    }

    return (
        <div className="fullscreen text-white overflow-hidden">
            <ServerNavbar handleSignout={handleSignout} />
            <div className="grid grid-cols-12 fullsize">
                <div className="col-span-2 fullsize bg-slack-sidebar-normal">
                    <ServerSidebar setChannelModalOpen={setChannelModalOpen} />
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
    )
}

export default ServerLayout
