import { selectCurrentUser } from 'pages/auth/components/user.slice'
import React, { FunctionComponent } from 'react'
import { useAppSelector } from 'redux/hooks'
import ProfileDropdown from './ProfileDropdown'

interface ServerNavbarProps {
    handleSignout: Function
}

const ServerNavbar: FunctionComponent<ServerNavbarProps> = ({
    handleSignout,
}) => {
    const currentUser = useAppSelector(selectCurrentUser)

    return (
        <div className="w-full bg-slack-navbar py-3 max-h-15">
            <div className="flex items-center justify-center">
                <input
                    type="text"
                    className="bg-slack-searchbar rounded-md w-2/5 text-slack-text-focus col-start-2 absolute placeholder-white px-4"
                    placeholder="Search something in ..."
                />
                <ProfileDropdown
                    username={currentUser.user?.displayName}
                    avatarUrl={currentUser.user?.photoUrl}
                    status={currentUser.user?.status}
                    handleSignout={() => handleSignout()}
                />
            </div>
        </div>
    )
}

export default ServerNavbar
