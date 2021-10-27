import { onChildAdded, onValue, ref } from '@firebase/database'
import { database } from 'firebase/firebase'
import {
    fetchUser,
    selectCurrentUser,
    signOutAndRemoveUser,
} from 'pages/auth/components/user.slice'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { addChannel, setChannels } from './channel.slice'

import AddChannelModal from './modal/AddChannelModal'
import ServerSidebar from './sidebar/ServerSidebar'
import ServerNavbar from './navbar/ServerNavbar'
import Messages from './message/Messages'

const ServerLayout: FunctionComponent = () => {
    const [isFirstLoad, setIsFirstLoad] = useState(true)
    const [isChannelModalOpen, setChannelModalOpen] = useState(false)

    const currentUser = useAppSelector(selectCurrentUser)
    const dispatch = useAppDispatch()

    useEffect(() => {
        // Get user info when load
        fetchUserInfo()

        // Get channels' info when load
        onValue(
            ref(database, 'channels'),
            async (data) => {
                dispatch(setChannels(data.val()))
            },
            { onlyOnce: true },
        )

        // Place listener for database changed
        const unsubscribe = onChildAdded(ref(database, 'channels'), (data) => {
            if (!isFirstLoad) {
                dispatch(addChannel(data.val()))
            }
        })

        setIsFirstLoad(false)

        return () => unsubscribe()
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
                    <Messages />
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
