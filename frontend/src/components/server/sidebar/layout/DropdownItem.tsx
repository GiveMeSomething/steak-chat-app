import React, { FunctionComponent } from 'react'
import { useAppSelector } from 'redux/hooks'

import {
    ChannelInfo,
    selectCurrentChannel
} from 'components/server/redux/channels/channels.slice'
import { selectChannelNotifications } from 'components/server/redux/notifications/notifications.slice'

import { Icon, Label } from 'semantic-ui-react'

import { getDropdownStyle } from './DropdownLayout'
import ScreenOverlay from 'components/commons/overlay/ScreenOverlay'
import ChannelOptions from './ChannelOptions'

interface DropdownItemProps {
    channel: ChannelInfo
    selectedChannel?: ChannelInfo
    handleSelectChannel: (channel: ChannelInfo) => void
    handleOpenChannelMenu: (channel: ChannelInfo) => void
    handleCloseChannelMenu: () => void
    isStarred: boolean
}

const DropdownItem: FunctionComponent<DropdownItemProps> = ({
    channel,
    isStarred,
    selectedChannel,
    handleSelectChannel,
    handleOpenChannelMenu,
    handleCloseChannelMenu
}) => {
    const currentChannel = useAppSelector(selectCurrentChannel)
    const notifications = useAppSelector(selectChannelNotifications)

    const handleItemClick = () => {
        handleSelectChannel(channel)
    }

    const handleItemRightClick = (
        event: React.MouseEvent<HTMLDivElement>
    ): void => {
        // Prevent open context menu
        event.preventDefault()

        // Prevent event bubbling to onClick
        event.stopPropagation()

        handleOpenChannelMenu(channel)
    }

    const handleCloseMenu = (event: React.MouseEvent<HTMLDivElement>): void => {
        // Prevent open context menu
        event.preventDefault()

        // Prevent event bubbling to onClick
        event.stopPropagation()

        handleCloseChannelMenu()
    }

    const OptionButton: FunctionComponent<{}> = () => {
        if (selectedChannel && selectedChannel.id === channel.id) {
            return (
                <>
                    <div className="z-20">
                        <ChannelOptions
                            starred={isStarred}
                            selectedChannel={selectedChannel}
                            isOpen={true}
                            closeMenu={handleCloseMenu}
                        />
                    </div>
                    <ScreenOverlay handleOnClick={handleCloseMenu} />
                </>
            )
        } else {
            return (
                <Icon
                    name="ellipsis horizontal"
                    onClick={handleOpenChannelMenu}
                />
            )
        }
    }

    return (
        <div
            className={`flex items-center justify-between fullsize pl-4 cursor-pointer font-semibold ${getDropdownStyle(
                channel.id === currentChannel.id
            )}`}
            key={channel.id}
            onClick={handleItemClick}
            onContextMenu={handleItemRightClick}
        >
            <div className="flex items-baseline px-4 py-2">
                <Icon name="hashtag" className="m-0" />
                <h4 className="leading-6 mr-2">{channel.name}</h4>
                {notifications[channel.id] > 0 && (
                    <Label circular color="red">
                        {notifications[channel.id]}
                    </Label>
                )}
            </div>
            <div className="ml-auto pr-4">
                <div className="flex items-baseline cursor-pointer">
                    <OptionButton />
                </div>
            </div>
        </div>
    )
}

export default DropdownItem
