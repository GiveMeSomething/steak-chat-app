import { selectCurrentUser, UserInfo } from 'pages/auth/components/auth.slice'
import React, { FunctionComponent } from 'react'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { Accordion, Icon } from 'semantic-ui-react'
import { CHANNEL_NAME_SEPARATOR } from 'utils/appConst'
import {
    ChannelInfo,
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

    const getDirectChannelId = (userId: string) => {
        if (currentUser) {
            // Create direct channel id based on userId and currentUser
            if (userId < currentUser.uid) {
                return `${userId}${CHANNEL_NAME_SEPARATOR}${currentUser.uid}`
            } else {
                return `${currentUser.uid}${CHANNEL_NAME_SEPARATOR}${userId}`
            }
        }

        // To avoid returning undefined
        // If there is no currentUser, the server should redirect to Login page
        return ''
    }

    const generateDirectChannelInfo = (channelId: string, toUser: UserInfo) => {
        if (currentUser) {
            const directChannelInfo: ChannelInfo = {
                id: channelId,
                name: toUser.username,
                createdBy: {
                    uid: currentUser?.uid,
                    username: currentUser?.username,
                    photoUrl: currentUser.photoUrl,
                },
            }

            return directChannelInfo
        }
    }

    // Check selected direct channel to highlight it in UI
    const isCurrentUserActive = (userId: string): boolean => {
        if (currentChannel.id === getDirectChannelId(userId)) {
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
        const directChannelId = getDirectChannelId(user.uid)

        // Create channel info to set currentChannel
        const directChannelInfo = generateDirectChannelInfo(
            directChannelId,
            user,
        )

        // This should be always true
        // If there is no currentUser (result in no channelInfo), the server should redirect to Login
        if (directChannelInfo) {
            dispatch(setIsDirectChannel(true))
            dispatch(setCurrentChannel(directChannelInfo))
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
