import React, { FunctionComponent, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { Accordion, Icon, Label } from 'semantic-ui-react'
import {
    ChannelInfo,
    selectCurrentChannel,
    selectStarredChannels,
    setCurrentChannel,
    setIsDirectChannel,
} from '../../slices/channel.slice'
import { selectChannelNotifications } from '../../slices/notification.slice'
import ChannelOptionsDropdown from '../ChannelOptionsDropdown'

interface StarredChannelsDropdownProps {
    isActive: boolean
    setActive: React.Dispatch<React.SetStateAction<boolean>>
}

const StarredChannelsDropdown: FunctionComponent<StarredChannelsDropdownProps> =
    ({ isActive, setActive }) => {
        const [selectedChannel, setSelectedChannel] = useState<ChannelInfo>()

        const dispatch = useAppDispatch()

        const currentChannel = useAppSelector(selectCurrentChannel)
        const starredChannel = useAppSelector(selectStarredChannels)
        const notifications = useAppSelector(selectChannelNotifications)

        // Handle on dropdown click
        const handleOnStarredChannelMenuClick = () => {
            setActive(!isActive)
        }

        // Select current channel
        const handleOnChannelClick = async (channelInfo: ChannelInfo) => {
            dispatch(setIsDirectChannel(false))
            await dispatch(setCurrentChannel(channelInfo))
        }

        const handleChannelRightClick = (
            event: React.MouseEvent<HTMLDivElement>,
            channel: ChannelInfo,
        ) => {
            // Prevent open context menu
            event.preventDefault()

            // Prevent event bubbling to onClick
            event.stopPropagation()

            setSelectedChannel(channel)
        }

        const closeChannelOptions = (
            event: React.MouseEvent<HTMLDivElement>,
        ) => {
            event.preventDefault()

            // Prevent event bubbling to onClick
            event.stopPropagation()

            setSelectedChannel(undefined)
        }

        return (
            <Accordion>
                <Accordion.Title
                    active={isActive}
                    onClick={handleOnStarredChannelMenuClick}
                >
                    <div className="flex h-full items-center justify-between px-4 hover:bg-slack-sidebar-hover text-white">
                        <div className="flex items-baseline">
                            <Icon name="dropdown" />
                            <h4>Starred</h4>
                        </div>
                    </div>
                </Accordion.Title>
                <Accordion.Content active={isActive}>
                    {Object.values(starredChannel).map((channel) => {
                        return (
                            <div
                                className={`flex items-center justify-between h-full w-full pl-4 cursor-pointer font-semibold
                                    ${
                                        channel.id === currentChannel.id
                                            ? 'sidebar-dropdown-item__active'
                                            : 'sidebar-dropdown-item__inactive'
                                    }`}
                                key={channel.id}
                                onClick={() => handleOnChannelClick(channel)}
                                onContextMenu={(e) =>
                                    handleChannelRightClick(e, channel)
                                }
                            >
                                <div className="flex items-baseline px-4 py-2">
                                    <Icon name="hashtag" className="m-0" />
                                    <h4 className="leading-6 mr-2">
                                        {channel.name}
                                    </h4>
                                    {notifications[channel.id] > 0 && (
                                        <Label circular color="red">
                                            {notifications[channel.id]}
                                        </Label>
                                    )}
                                </div>
                                <div className="ml-auto pr-4">
                                    <div className="flex items-baseline cursor-pointer">
                                        {selectedChannel?.id === channel.id ? (
                                            <>
                                                <div className="z-20">
                                                    <ChannelOptionsDropdown
                                                        starred={true}
                                                        selectedChannel={
                                                            channel
                                                        }
                                                        isOpen={true}
                                                        closeDropdown={
                                                            closeChannelOptions
                                                        }
                                                    />
                                                </div>
                                                <div
                                                    className="absolute h-screen w-screen top-0 left-0 z-10"
                                                    onClick={(e) =>
                                                        closeChannelOptions(e)
                                                    }
                                                ></div>
                                            </>
                                        ) : (
                                            <Icon name="ellipsis horizontal" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </Accordion.Content>
            </Accordion>
        )
    }

export default StarredChannelsDropdown
