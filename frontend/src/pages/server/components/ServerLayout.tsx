import React, { FunctionComponent, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'redux/hooks'

import { signOutAndRemoveUser } from 'pages/auth/components/auth.slice'

import ServerSidebar from './sidebar/ServerSidebar'
import ServerNavbar from './navbar/ServerNavbar'
import AddChannelModal from './modal/AddChannelModal'
import ServerMessages from './message/ServerMessages'
import MetaPanel from './metaPanel/MetaPanel'
import { selectIsMetaPanelOpen } from './slices/metaPanel.slice'

const ServerLayout: FunctionComponent = () => {
    const [isChannelModalOpen, setChannelModalOpen] = useState<boolean>(false)
    const dispatch = useAppDispatch()

    const isMetaPanelOpen = useAppSelector(selectIsMetaPanelOpen)

    const handleSignout = async () => {
        await dispatch(signOutAndRemoveUser())
    }

    return (
        <div className="fullscreen text-white overflow-hidden">
            <div className="flex flex-col w-full h-full">
                <ServerNavbar handleSignout={handleSignout} />
                <div className="grid grid-cols-12 w-full h-full">
                    <div className="col-span-2 w-full h-full bg-slack-sidebar-normal">
                        <ServerSidebar
                            setChannelModalOpen={setChannelModalOpen}
                        />
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
                <AddChannelModal
                    isOpen={isChannelModalOpen}
                    setOpen={setChannelModalOpen}
                />
            </div>
        </div>
    )
}

export default ServerLayout
