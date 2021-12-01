import React, { FunctionComponent, useState } from 'react'
import { useAppSelector } from 'redux/hooks'

import { selectCurrentChannel } from 'components/server/redux/channel.slice'

import SearchModal from 'components/server/navbar/SearchModal'
import ProfileDropdown from './ProfileDropdown'

interface ServerNavbarProps {}

const ServerNavbar: FunctionComponent<ServerNavbarProps> = () => {
    const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false)

    const currentChannel = useAppSelector(selectCurrentChannel)

    // Open a bigger search 😅
    const handleOnSearchClick = () => {
        setIsSearchModalOpen(true)
    }
    return (
        <div className="w-full bg-slack-navbar py-2">
            <div className="flex items-center justify-center relative">
                <input
                    type="text"
                    className="bg-slack-searchbar rounded-md w-1/2 text-slack-text-focus col-start-2 absolute placeholder-white px-4 cursor-pointer"
                    placeholder={`Search something in #${currentChannel.name}`}
                    readOnly={true}
                    onClick={handleOnSearchClick}
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
