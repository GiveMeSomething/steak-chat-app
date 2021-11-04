import { selectCurrentUser, UserInfo } from 'pages/auth/components/auth.slice'
import React, { FunctionComponent } from 'react'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { Accordion, Icon } from 'semantic-ui-react'
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

    const handleOnChannelUserMenuClick = () => {
        setActive(!isActive)
    }

    const handleOnChannelUserClick = (user: UserInfo) => {
        if (currentUser) {
            const { uid } = currentUser

            let directChannelId = ''

            // Create direct channel id based on 2 participants
            if (uid < user.uid) {
                directChannelId = `${uid}/${user.uid}`
            } else {
                directChannelId = `${user.uid}/${uid}`
            }

            // Create channel info to set currentChannel
            const directChannelInfo: ChannelInfo = {
                id: directChannelId,
                name: user.username,
                createdBy: {
                    uid: currentUser?.uid,
                    username: currentUser?.username,
                    photoUrl: currentUser.photoUrl,
                },
            }
            dispatch(setIsDirectChannel(true))
            dispatch(setCurrentChannel(directChannelInfo))
        }
    }

    const isCurrentUserActive = (userId: string): boolean => {
        const participants = currentChannel.id.split('/')

        if (participants.length < 2) {
            return false
        } else {
            return participants.includes(userId)
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
