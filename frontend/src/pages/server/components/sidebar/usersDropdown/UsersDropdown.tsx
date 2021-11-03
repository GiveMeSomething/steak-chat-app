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
        const directChannelInfo: ChannelInfo = {
            id: user.uid,
            name: user.username,
            createdBy: {
                uid: currentUser.user?.uid,
                username: currentUser.user?.username,
            },
        }
        dispatch(setIsDirectChannel(true))
        dispatch(setCurrentChannel(directChannelInfo))
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
                                    user.uid === currentChannel.id
                                        ? 'sidebar-dropdown-item__active'
                                        : 'sidebar-dropdown-item__inactive'
                                }`}
                            key={user.uid}
                            onClick={() => handleOnChannelUserClick(user)}
                        >
                            <UsersDropdownItem
                                user={user}
                                currentUser={currentUser.user}
                            />
                        </div>
                    )
                })}
            </Accordion.Content>
        </Accordion>
    )
}

export default UsersDropdown
