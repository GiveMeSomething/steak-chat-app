import React, { FunctionComponent } from 'react'

import { UserInfo } from 'components/auth/redux/auth.slice'

import { UserStatus } from 'utils/appEnum'

import { Icon } from 'semantic-ui-react'

interface UsersDropdownItemProps {
    user: UserInfo
    currentUser?: UserInfo
}

const UsersDropdownItem: FunctionComponent<UsersDropdownItemProps> = ({
    user,
    currentUser,
}) => {
    const StatusIcon = () => {
        switch (user.status) {
            case UserStatus.ONLINE:
                return <Icon name="circle" color="green" size="small" />
            case UserStatus.BUSY:
                return <Icon name="circle" color="red" size="small" />
            default:
                return <Icon name="circle" color="grey" size="small" />
        }
    }

    return (
        <>
            <div className="flex items-center px-4 py-2">
                <div className="rounded-md max-h-6 w-6 mr-2 relative">
                    <img src={user.photoUrl} className="rounded-md" />
                    <div className="absolute -right-2 -bottom-2">
                        <StatusIcon />
                    </div>
                </div>
                <h4 className="leading-6">
                    <span>{user.username}</span>
                    {user.uid === currentUser?.uid && (
                        <span className="mx-2 current-indicator">you</span>
                    )}
                </h4>
            </div>
            <div className="ml-auto pr-4">
                <div className="flex items-baseline cursor-pointer">
                    <Icon name="ellipsis horizontal" />
                </div>
            </div>
        </>
    )
}

export default UsersDropdownItem
