import React, { FunctionComponent, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'redux/hooks'

import { signout } from 'components/auth/redux/auth.thunk'

import ServerSidebar from './sidebar/ServerSidebar'
import ServerNavbar from './navbar/ServerNavbar'
import AddChannelModal from 'components/server/modal/AddChannelModal'
import MetaPanel from 'components/server/metaPanel/MetaPanel'
import ServerMessages from 'components/server/messagePanel/ServerMessages'
import { selectIsMetaPanelOpen } from 'components/server/redux/metaPanel.slice'

const ServerLayout: FunctionComponent = () => {
    const [isChannelModalOpen, setChannelModalOpen] = useState<boolean>(false)
    const dispatch = useAppDispatch()

    const isMetaPanelOpen = useAppSelector(selectIsMetaPanelOpen)

    const handleSignout = async () => {
        await dispatch(signout())
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
