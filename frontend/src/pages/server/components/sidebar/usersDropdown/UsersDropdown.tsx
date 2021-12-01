import { selectCurrentUser, UserInfo } from 'components/auth/redux/auth.slice'
import React, { FunctionComponent } from 'react'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { Accordion, Icon } from 'semantic-ui-react'
import {
    generateDirectChannelInfo,
    getDirectChannelId,
} from 'utils/channelUtil'
import {
    selectCurrentChannel,
    setCurrentChannel,
    setIsDirectChannel,
} from '../../slices/channel.slice'
import { selectChannelUsers } from '../../slices/channelUsers.slice'
import UsersDropdownItem from './UsersDropdownItem'

interface UsersDropdownProps {
    isActive: boolean
    setActive: React.Dispatch<React.SetStateAction<boolean>>
}

const UsersDropdown: FunctionComponent<UsersDropdownProps> = ({
    isActive,
    setActive,
}) => {
    const dispatch = useAppDispatch()

    const currentUser = useAppSelector(selectCurrentUser)
    const channelUsers = useAppSelector(selectChannelUsers)
    const currentChannel = useAppSelector(selectCurrentChannel)

    const directChannelId = (userId: string) => {
        if (currentUser) {
            return getDirectChannelId(currentUser.uid, userId)
        }

        return ''
    }

    // Check selected direct channel to highlight it in UI
    const isCurrentUserActive = (userId: string): boolean => {
        if (currentChannel.id === directChannelId(userId)) {
            return true
        }

        return false
    }

    // Open or close channel menu
    const handleOnChannelUserMenuClick = () => {
        setActive(!isActive)
    }

    // Change currentChannel and switch to directChannel mode
    const handleOnChannelUserClick = (user: UserInfo) => {
        if (currentUser) {
            const channelId = directChannelId(user.uid)

            // Create channel info to set currentChannel
            const directChannelInfo = generateDirectChannelInfo(
                currentUser,
                channelId,
                user.username,
            )

            // This should be always true
            // If there is no currentUser (result in no channelInfo), the server should redirect to Login
            if (directChannelInfo) {
                dispatch(setIsDirectChannel(true))
                dispatch(setCurrentChannel(directChannelInfo))
            }
        }
    }

    return (
        <Accordion>
            <Accordion.Title
                active={isActive}
                onClick={handleOnChannelUserMenuClick}
            >
                <div className="flex h-full items-center justify-between px-4 hover:bg-slack-sidebar-hover text-white">
                    <div className="flex items-baseline">
                        <Icon name="dropdown" />
                        <h4>Users</h4>
                    </div>
                </div>
            </Accordion.Title>
            <Accordion.Content active={isActive}>
                {Object.values(channelUsers).map((user) => {
                    return (
                        <div
                            className={`flex items-center justify-between h-full w-full pl-4 cursor-pointer font-semibold
                                ${
                                    isCurrentUserActive(user.uid)
                                        ? 'sidebar-dropdown-item__active'
                                        : 'sidebar-dropdown-item__inactive'
                                }`}
                            key={user.uid}
                            onClick={() => handleOnChannelUserClick(user)}
                        >
                            <UsersDropdownItem
                                user={user}
                                currentUser={currentUser}
                            />
                        </div>
                    )
                })}
            </Accordion.Content>
        </Accordion>
    )
}

export default UsersDropdown
