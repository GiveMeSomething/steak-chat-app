import React, { FunctionComponent, useState } from 'react'
import { useAppSelector } from 'redux/hooks'

import { selectCurrentChannel } from 'components/server/redux/channels/channels.slice'

import SearchModal from 'components/server/navbar/SearchModal'
import ProfileDropdown from './ProfileDropdown'

interface ServerNavbarProps {}

const ServerNavbar: FunctionComponent<ServerNavbarProps> = () => {
    const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false)

    const currentChannel = useAppSelector(selectCurrentChannel)

    return (
        <div className="w-full bg-slack-navbar py-2">
            <div className="flex flex-center relative">
                <input
                    type="text"
                    className=" rounded-md w-1/2 col-start-2 fixed px-4 cursor-pointer bg-slack-searchbar text-slack-text-focus placeholder-white"
                    placeholder={`Search something in #${currentChannel.name}`}
                    readOnly={true}
                    onClick={() => setIsSearchModalOpen(true)}
                />
                <ProfileDropdown />
            </div>
            <SearchModal
                isOpen={isSearchModalOpen}
                setOpen={setIsSearchModalOpen}
            />
        </div>
    )
}

export default ServerNavbar
