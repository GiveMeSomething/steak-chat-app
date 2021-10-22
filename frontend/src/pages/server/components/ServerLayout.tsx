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
import ProfileDropdown from './ProfileDropdown'
import ServerSidebar from './ServerSidebar'

const ServerLayout: FunctionComponent = () => {
    const [isChannelModalOpen, setChannelModalOpen] = useState(false)
    const currentUser = useAppSelector(selectCurrentUser)
    const dispatch = useAppDispatch()

    useEffect(() => {
        // Get user info when load
        fetchUserInfo()

        // Get channels' info when load
        const unsubscribe = onValue(
            ref(database, 'channels'),
            async (data) => {
                dispatch(setChannels(data.val()))
            },
            { onlyOnce: true },
        )

        // Place listener for database changed
        onChildAdded(ref(database, 'channels'), (data) => {
            dispatch(addChannel(data.val()))
        })

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
            <div className="w-full bg-slack-navbar py-3 max-h-15">
                <div className="flex items-center justify-center">
                    <input
                        type="text"
                        className="bg-slack-searchbar w-2/5 text-slack-text-focus col-start-2 absolute placeholder-white px-4"
                        placeholder="Search something in ..."
                    />
                    <ProfileDropdown
                        username={currentUser.user?.displayName}
                        avatarUrl={currentUser.user?.photoUrl}
                        status={currentUser.user?.status}
                        handleSignout={handleSignout}
                    />
                </div>
            </div>
            <div className="grid grid-cols-12 fullsize">
                <div className="col-span-2 fullsize bg-slack-sidebar-normal">
                    <ServerSidebar setChannelModalOpen={setChannelModalOpen} />
                </div>
                <div className="col-span-10 w-full h-full bg-white text-gray-800">
                    Messages
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
