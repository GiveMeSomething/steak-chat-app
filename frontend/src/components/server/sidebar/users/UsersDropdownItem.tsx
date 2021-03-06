import React, { FunctionComponent } from 'react'
import { useAppSelector } from 'redux/hooks'

import { selectCurrentUser, UserInfo } from 'components/auth/redux/auth.slice'

import { Icon } from 'semantic-ui-react'

import StatusIcon from 'components/commons/StatusIcon'

interface UsersDropdownItemProps {
    user: UserInfo
}

const UsersDropdownItem: FunctionComponent<UsersDropdownItemProps> = ({
    user
}) => {
    const currentUser = useAppSelector(selectCurrentUser)
    const { photoUrl, status, username, uid } = user

    return (
        <>
            <div className="flex items-center px-4 py-2">
                <div className="rounded-md max-h-6 w-6 mr-2 relative">
                    <img src={photoUrl} className="rounded-md" alt="avatar" />
                    <StatusIcon
                        userStatus={status}
                        size="small"
                        className="absolute -right-2 -bottom-2"
                    />
                </div>
                <h4 className="leading-6">
                    <span>{username}</span>
                    {currentUser && uid === currentUser.uid && (
                        <span className="mx-2 current-indicator text-gray-500">
                            you
                        </span>
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
