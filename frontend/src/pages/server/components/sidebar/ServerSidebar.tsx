import React, { FunctionComponent, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { Accordion, Icon } from 'semantic-ui-react'
import { selectChannels, setCurrentChannel } from '../channel.slice'

interface SidebarProps {
    setChannelModalOpen: Function
}

const ServerSidebar: FunctionComponent<SidebarProps> = (props) => {
    const [isActive, setActive] = useState(false)

    const channels = useAppSelector(selectChannels)
    const dispatch = useAppDispatch()

    const handleOnChannelsClick = () => {
        setActive(!isActive)
    }

    const handleOnSingleChannelClick = (channelId: any) => {
        dispatch(setCurrentChannel(channelId))
    }

    return (
        <>
            <div className="flex items-center justify-between px-3 py-2 border-t-2 border-b-2 border-opacity-90 border-gray-700">
                <div className="flex items-baseline h-full">
                    <h3 className="font-bold"># ServerName</h3>
                </div>
            </div>
            <div className="py-4">
                <Accordion>
                    <Accordion.Title
                        active={isActive}
                        onClick={handleOnChannelsClick}
                    >
                        <div className="flex h-full items-center justify-between px-4 hover:bg-slack-sidebar-hover text-white">
                            <div className="flex items-baseline">
                                <Icon name="dropdown" />
                                <h4>Channels</h4>
                            </div>
                            <div
                                className="flex items-baseline justify-center hover:bg-slack-sidebar-focus leading-6 align-middle px-2 rounded-md cursor-pointer"
                                onClick={() => props.setChannelModalOpen(true)}
                            >
                                <h3>+</h3>
                            </div>
                        </div>
                    </Accordion.Title>
                    <Accordion.Content active={isActive}>
                        {Object.values(channels.channels).map((channel) => {
                            return (
                                <div
                                    className={`flex items-center justify-between h-full w-full pl-4 cursor-pointer
                                    ${
                                        channel.id === channels.currentChannel
                                            ? 'bg-slack-sidebar-focus text-slack-text-focus'
                                            : 'hover:bg-slack-sidebar-hover text-slack-text-blur'
                                    }`}
                                    key={channel.id}
                                    onClick={() =>
                                        handleOnSingleChannelClick(channel.id)
                                    }
                                >
                                    <div className="flex items-baseline px-4 py-2">
                                        <Icon name="hashtag" className="m-0" />
                                        <h4 className="leading-6">
                                            {channel.name}
                                        </h4>
                                    </div>
                                    <div className="ml-auto pr-4">
                                        <div className="flex items-baseline cursor-pointer">
                                            <Icon name="ellipsis horizontal" />
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </Accordion.Content>
                </Accordion>
            </div>
        </>
    )
}

export default ServerSidebar
