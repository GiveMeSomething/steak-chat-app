import React, { FunctionComponent, useState } from 'react'
import { useAppSelector } from 'redux/hooks'

import { selectCurrentUser } from 'components/auth/redux/auth.slice'
import { selectCurrentChannel } from 'components/server/redux/channel.slice'

import SearchModal from 'components/server/modal/SearchModal'
import ProfileDropdown from './ProfileDropdown'
import { UserStatus } from 'utils/appEnum'

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

    if (currentUser) {
        const { username, photoUrl, status } = currentUser
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
                        username={username}
                        avatarUrl={photoUrl}
                        userStatus={status || UserStatus.AWAY}
                        handleSignout={() => handleSignout()}
                    />
                </div>
                <SearchModal
                    isOpen={isSearchModalOpen}
                    setOpen={setIsSearchModalOpen}
                />
            </div>
        )
    } else {
        return null
    }
}

export default ServerNavbar
