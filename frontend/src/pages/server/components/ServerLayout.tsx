import {
    selectCurrentUser,
    signOutAndRemoveUser,
} from 'pages/auth/components/user.slice'
import React, { FunctionComponent, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import AddChannelModal from './AddChannelModal'
import ProfileDropdown from './ProfileDropdown'

const ServerLayout: FunctionComponent = () => {
    const [isChannelModalOpen, setChannelModalOpen] = useState(false)
    const currentUser = useAppSelector(selectCurrentUser)
    const dispatch = useAppDispatch()

    const handleSignout = async () => {
        await dispatch(signOutAndRemoveUser())
    }

    return (
        <div className="fullscreen text-white overflow-hidden">
            <div className="w-full bg-slack-navbar py-3 max-h-15">
                <div className="flex items-center justify-center">
                    <input
                        type="text"
                        className="bg-slack-searchbar w-2/5 text-slack-text-light col-start-2 absolute placeholder-white px-4"
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
                    <div className="flex items-center justify-between p-2 border-t-2 border-b-2 border-opacity-90 border-gray-700">
                        <h2>#ServerName</h2>
                        <h2>Gear</h2>
                    </div>
                    <div className="py-4">
                        <div className="flex h-full items-center justify-between py-2 px-4 hover:bg-slack-sidebar-hover">
                            <div>
                                <h4>Channels</h4>
                            </div>
                            <div
                                className="flex items-center justify-center hover:bg-slack-sidebar-focus leading-6 align-middle px-2 rounded-md cursor-pointer"
                                onClick={() => setChannelModalOpen(true)}
                            >
                                <h3>+</h3>
                            </div>
                        </div>
                    </div>
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
