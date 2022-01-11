import React, { FunctionComponent } from 'react'
import { useAppDispatch, useAppSelector } from 'redux/hooks'

import { selectCurrentUser, UserInfo } from 'components/auth/redux/auth.slice'
import { setIsDirectChannel } from 'components/server/redux/channels/channels.slice'
import { setCurrentChannel } from 'components/server/redux/channels/channels.thunk'

import {
    generateDirectChannelInfo,
    getDirectChannelId
} from 'utils/channelUtil'

import { Dropdown } from 'semantic-ui-react'

import ScreenOverlay from 'components/commons/overlay/ScreenOverlay'

interface UserMenuProps {
    isOpen: boolean
    isUpward: boolean
    selectedUser: UserInfo
    menuStyle: string
    openMetaPanel: (user: UserInfo) => void
    closeMenu: (event: React.MouseEvent<any>) => void
}

const UserMenu: FunctionComponent<UserMenuProps> = ({
    isOpen,
    isUpward,
    selectedUser,
    menuStyle,
    openMetaPanel,
    closeMenu
}) => {
    const dispatch = useAppDispatch()
    const currentUser = useAppSelector(selectCurrentUser)

    const menuOptions = {
        profile: {
            text: 'View profile'
        },
        message: {
            text: `Message ${selectedUser.username}`
        },
        copyName: {
            text: 'Copy name',
            disabled: true
        },
        copyLink: {
            text: 'Copy link',
            disabled: true
        }
    }

    const directChannelId = (userId: string): string => {
        if (currentUser) {
            return getDirectChannelId(currentUser.uid, userId)
        }

        return ''
    }

    const handleOnViewProfileClick = (
        event: React.MouseEvent<HTMLDivElement>
    ): void => {
        openMetaPanel(selectedUser)
        closeMenu(event)
    }

    const handleOnMessageClick = (
        event: React.MouseEvent<HTMLDivElement>
    ): void => {
        if (currentUser) {
            const channelId = directChannelId(selectedUser.uid)
            const directChannelInfo = generateDirectChannelInfo(
                currentUser,
                channelId,
                selectedUser.username
            )

            if (directChannelInfo) {
                dispatch(setIsDirectChannel(true))
                dispatch(setCurrentChannel(directChannelInfo))
            }
        }

        closeMenu(event)
    }

    return (
        <>
            <Dropdown
                icon={null}
                id="message-user-settings"
                open={isOpen}
                upward={isUpward}
                className={menuStyle}
            >
                <Dropdown.Menu>
                    <Dropdown.Item
                        {...menuOptions.profile}
                        onClick={handleOnViewProfileClick}
                    />
                    <Dropdown.Divider />
                    <Dropdown.Item
                        {...menuOptions.message}
                        onClick={handleOnMessageClick}
                    />
                    <Dropdown.Divider />
                    <Dropdown.Item {...menuOptions.copyName} />
                    <Dropdown.Item {...menuOptions.copyLink} />
                </Dropdown.Menu>
            </Dropdown>
            <ScreenOverlay handleOnClick={closeMenu} />
        </>
    )
}

export default UserMenu
