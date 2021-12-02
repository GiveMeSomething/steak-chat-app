import React, { FunctionComponent } from 'react'
import { useAppDispatch, useAppSelector } from 'redux/hooks'

import { selectCurrentUser, UserInfo } from 'components/auth/redux/auth.slice'
import {
    setIsDirectChannel,
    setCurrentChannel,
} from 'components/server/redux/channel.slice'

import {
    generateDirectChannelInfo,
    getDirectChannelId,
} from 'utils/channelUtil'

import { Dropdown } from 'semantic-ui-react'

interface OptionsMenuProps {
    isOpen: boolean
    selectedUser: UserInfo
    openMetaPanel: Function
    closeMenu: Function
    menuStyle: string
    upward: boolean
}

const OptionsMenu: FunctionComponent<OptionsMenuProps> = ({
    isOpen,
    selectedUser,
    openMetaPanel,
    closeMenu,
    menuStyle,
    upward,
}) => {
    const dispatch = useAppDispatch()
    const currentUser = useAppSelector(selectCurrentUser)

    const menuOptions = {
        profile: {
            text: 'View profile',
        },
        message: {
            text: `Message ${selectedUser.username}`,
        },
        copyName: {
            text: 'Copy name',
            disabled: true,
        },
        copyLink: {
            text: 'Copy link',
            disabled: true,
        },
    }

    const directChannelId = (userId: string): string => {
        return currentUser ? getDirectChannelId(currentUser.uid, userId) : ''
    }

    const handleOnViewProfileClick = (
        event: React.MouseEvent<HTMLDivElement>,
    ): void => {
        openMetaPanel()
        closeMenu(event)
    }

    const handleOnMessageClick = (
        event: React.MouseEvent<HTMLDivElement>,
    ): void => {
        if (currentUser) {
            const channelId = directChannelId(selectedUser.uid)
            const directChannelInfo = generateDirectChannelInfo(
                currentUser,
                channelId,
                selectedUser.username,
            )

            if (directChannelInfo) {
                dispatch(setIsDirectChannel(true))
                dispatch(setCurrentChannel(directChannelInfo))
            }
        }

        closeMenu(event)
    }

    return (
        <Dropdown
            icon={null}
            id="message-user-settings"
            open={isOpen}
            upward={upward}
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
    )
}

export default OptionsMenu
