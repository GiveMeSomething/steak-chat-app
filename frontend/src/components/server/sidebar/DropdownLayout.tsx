import React, { FunctionComponent, MouseEventHandler, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'redux/hooks'

import { selectChannelNotifications } from 'components/server/redux/notifications/notifications.slice'
import {
    ChannelInfo,
    selectCurrentChannel,
    setIsDirectChannel
} from 'components/server/redux/channels/channels.slice'
import { setCurrentChannel } from 'components/server/redux/channels/channels.thunk'

import { Accordion, Icon, Label, Popup } from 'semantic-ui-react'

import ScreenOverlay from 'components/commons/overlay/ScreenOverlay'
import ChannelOptionsDropdown from './channels/ChannelOptionsMenu'

interface ChannelDropdownLayoutProps {
    isActive: boolean
    setActive: React.Dispatch<React.SetStateAction<boolean>>
    onAddClick?: MouseEventHandler<HTMLDivElement>
    haveAddNewOption: boolean
    haveContextMenu: boolean
    label: string
    starred: boolean
    listItems?: ChannelInfo[]
}

const ChannelDropdownLayout: FunctionComponent<ChannelDropdownLayoutProps> = ({
    isActive,
    setActive,
    onAddClick,
    haveAddNewOption,
    label,
    starred,
    listItems,
    children
}) => {
    const [selectedChannel, setSelectedChannel] = useState<ChannelInfo>()

    const dispatch = useAppDispatch()

    const currentChannel = useAppSelector(selectCurrentChannel)
    const notifications = useAppSelector(selectChannelNotifications)

    // Handle on dropdown click
    const handleOnChannelDropdownClick = () => {
        setActive(!isActive)
    }

    // Select current channel
    const handleOnChannelClick = async (channelInfo: ChannelInfo) => {
        dispatch(setIsDirectChannel(false))
        await dispatch(setCurrentChannel(channelInfo))
    }

    const handleOpenChannelMenu = (
        event: React.MouseEvent<HTMLDivElement>,
        channel: ChannelInfo
    ) => {
        // Prevent open context menu
        event.preventDefault()

        // Prevent event bubbling to onClick
        event.stopPropagation()

        setSelectedChannel(channel)
    }

    const closeChannelOptionMenu = (
        event: React.MouseEvent<HTMLDivElement>
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
                onClick={handleOnChannelDropdownClick}
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
                {
                    // Render based on children if existed, else render based on listItems
                    children ||
                        (listItems &&
                            Object.values(listItems).map((channel) => {
                                return (
                                    <div
                                        className={`flex items-center justify-between h-full w-full pl-4 cursor-pointer font-semibold
                                      ${
                                          channel.id === currentChannel.id
                                              ? 'sidebar-dropdown-item__active'
                                              : 'sidebar-dropdown-item__inactive'
                                      }`}
                                        key={channel.id}
                                        onClick={() =>
                                            handleOnChannelClick(channel)
                                        }
                                        onContextMenu={(
                                            e: React.MouseEvent<HTMLDivElement>
                                        ) => handleOpenChannelMenu(e, channel)}
                                    >
                                        <div className="flex items-baseline px-4 py-2">
                                            <Icon
                                                name="hashtag"
                                                className="m-0"
                                            />
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
                                                {selectedChannel?.id ===
                                                channel.id ? (
                                                    <>
                                                        <div className="z-20">
                                                            <ChannelOptionsDropdown
                                                                starred={
                                                                    starred
                                                                }
                                                                selectedChannel={
                                                                    channel
                                                                }
                                                                isOpen={true}
                                                                closeMenu={
                                                                    closeChannelOptionMenu
                                                                }
                                                            />
                                                        </div>
                                                        <ScreenOverlay
                                                            handleOnClick={
                                                                closeChannelOptionMenu
                                                            }
                                                        />
                                                    </>
                                                ) : (
                                                    <Icon
                                                        name="ellipsis horizontal"
                                                        onClick={(
                                                            e: React.MouseEvent<HTMLDivElement>
                                                        ) =>
                                                            handleOpenChannelMenu(
                                                                e,
                                                                channel
                                                            )
                                                        }
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            }))
                }
            </Accordion.Content>
        </Accordion>
    )
}

export default ChannelDropdownLayout
