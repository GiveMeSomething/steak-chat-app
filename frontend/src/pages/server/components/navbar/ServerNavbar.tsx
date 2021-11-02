import React, { FunctionComponent, useState } from 'react'
import { useAppSelector } from 'redux/hooks'

import { selectCurrentUser } from 'pages/auth/components/auth.slice'
import { selectCurrentChannel } from '../slices/channel.slice'

import SearchModal from '../modal/SearchModal'
import ProfileDropdown from './ProfileDropdown'

interface ServerNavbarProps {
    handleSignout: Function
}

const ServerNavbar: FunctionComponent<ServerNavbarProps> = ({
    handleSignout,
}) => {
    const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false)

    const currentUser = useAppSelector(selectCurrentUser)
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
                    className="bg-slack-searchbar rounded-md w-3/6 text-slack-text-focus col-start-2 absolute placeholder-white px-4 cursor-pointer"
                    placeholder={`Search something in #${currentChannel.name}`}
                    readOnly={true}
                    onClick={handleOnSearchClick}
                />
                <ProfileDropdown
                    username={currentUser.user?.displayName}
                    avatarUrl={currentUser.user?.photoUrl}
                    status={currentUser.user?.status}
                    handleSignout={() => handleSignout()}
                />
            </div>
            <SearchModal
                isOpen={isSearchModalOpen}
                setOpen={setIsSearchModalOpen}
            />
        </div>
    )
}

export default ServerNavbar
