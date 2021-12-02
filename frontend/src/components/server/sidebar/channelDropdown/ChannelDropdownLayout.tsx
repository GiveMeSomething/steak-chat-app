import ScreenOverlay from 'components/commons/ScreenOverlay'
import { selectChannelNotifications } from 'components/server/redux/notification.slice'
import React, { FunctionComponent, MouseEventHandler, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { Accordion, Icon, Label, Popup } from 'semantic-ui-react'
import {
    ChannelInfo,
    selectCurrentChannel,
    setIsDirectChannel,
    setCurrentChannel,
} from '../../redux/channel.slice'
import ChannelOptionsDropdown from './ChannelOptionsMenu'

interface ChannelDropdownLayoutProps {
    onAddClick?: MouseEventHandler<HTMLDivElement>
    isActive: boolean
    setActive: React.Dispatch<React.SetStateAction<boolean>>
    haveAddNewOption: boolean
    label: string
    starred: boolean
    listItems: ChannelInfo[]
}

const ChannelDropdownLayout: FunctionComponent<ChannelDropdownLayoutProps> = ({
    onAddClick,
    isActive,
    setActive,
    haveAddNewOption,
    label,
    starred,
    listItems,
}) => {
    const [selectedChannel, setSelectedChannel] = useState<ChannelInfo>()

    const dispatch = useAppDispatch()

    const currentChannel = useAppSelector(selectCurrentChannel)
    const notifications = useAppSelector(selectChannelNotifications)

    // Handle on dropdown click
    const handleOnChannelMenuClick = () => {
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

    const closeChannelOptions = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault()

        // Prevent event bubbling to onClick
        event.stopPropagation()

        setSelectedChannel(undefined)
    }

    return (
        <Accordion>
            <Accordion.Title
                active={isActive}
                onClick={handleOnChannelMenuClick}
            >
                <div className="flex h-full items-center justify-between px-4 hover:bg-slack-sidebar-hover text-white">
                    <div className="flex items-baseline">
                        <Icon name="dropdown" />
                        <h4>{label}</h4>
                    </div>

                    {haveAddNewOption && (
                        <Popup
                            content="Add new channel"
                            trigger={
                                <div
                                    className="flex items-baseline justify-center hover:bg-slack-sidebar-focus leading-6 align-middle px-2 rounded-md cursor-pointer"
                                    onClick={onAddClick}
                                >
                                    <h3>+</h3>
                                </div>
                            }
                        />
                    )}
                </div>
            </Accordion.Title>
            <Accordion.Content active={isActive}>
                {Object.values(listItems).map((channel) => {
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
                                                    starred={starred}
                                                    selectedChannel={channel}
                                                    isOpen={true}
                                                    closeMenu={
                                                        closeChannelOptions
                                                    }
                                                />
                                            </div>
                                            <ScreenOverlay
                                                handleOnClick={
                                                    closeChannelOptions
                                                }
                                            />
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

export default ChannelDropdownLayout
